/*
 * @ (#) AuthServiceImpl.java       1.0     10/09/2025
 *
 * Copyright (c) 2025 IUH. All rights reserved.
 */

package vn.edu.iuh.fit.backend.service.impl;
/*
 * @description:
 * @author: Nguyen Thanh Nhut
 * @date: 10/09/2025
 * @version:    1.0
 */

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import vn.edu.iuh.fit.backend.dto.request.LoginRequest;
import vn.edu.iuh.fit.backend.dto.request.RegisterRequest;
import vn.edu.iuh.fit.backend.dto.response.JwtResponse;
import vn.edu.iuh.fit.backend.dto.response.RegisterResponse;
import vn.edu.iuh.fit.backend.exception.BadRequestException;
import vn.edu.iuh.fit.backend.model.Role;
import vn.edu.iuh.fit.backend.model.User;
import vn.edu.iuh.fit.backend.repository.RoleRepository;
import vn.edu.iuh.fit.backend.repository.UserRepository;
import vn.edu.iuh.fit.backend.security.JwtUtil;
import vn.edu.iuh.fit.backend.service.AuthService;
import vn.edu.iuh.fit.backend.service.UserService;

import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtUtil jwtUtil;

    @Override
    public RegisterResponse registerNewUser(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Tên tài khoản đã tồn tại!");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email đã tồn tại!");
        }

        // Create new User
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setGender(request.getGender());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        Role userRole = roleRepository.findByRoleName("ROLE_USER")
                .orElseThrow(() -> new BadRequestException("Không tìm thấy role mặc định"));
        user.setRoles(Set.of(userRole));

        // 4. Save user to DB
        User savedUser = userRepository.save(user);

        return new RegisterResponse(
                savedUser.getUserId(),
                savedUser.getUsername(),
                savedUser.getEmail(),
                savedUser.getFirstName(),
                savedUser.getLastName(),
                savedUser.getGender(),
                savedUser.getRoles().stream()
                        .map(Role::getRoleName)
                        .collect(Collectors.toSet())
        );
    }

    @Override
    public JwtResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );
        } catch (AuthenticationException e) {
            throw new BadRequestException("Tài khooản hoặc mật khẩu không chính xác!");
        }

        UserDetails userDetails = userService.loadUserByUsername(request.getUsername());

        return new JwtResponse(jwtUtil.generateToken(userDetails.getUsername()));
    }
}
