/*
 * @ (#) UserServiceImpl.java       1.0     10/09/2025
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

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import vn.edu.iuh.fit.backend.dto.response.UserResponse;
import vn.edu.iuh.fit.backend.exception.AccessDeniedException;
import vn.edu.iuh.fit.backend.exception.UnauthorizedException;
import vn.edu.iuh.fit.backend.exception.UserNotFoundException;
import vn.edu.iuh.fit.backend.model.Role;
import vn.edu.iuh.fit.backend.model.User;
import vn.edu.iuh.fit.backend.repository.RoleRepository;
import vn.edu.iuh.fit.backend.repository.UserRepository;
import vn.edu.iuh.fit.backend.service.UserService;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    @Autowired
    public UserServiceImpl(UserRepository userRepository, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    @Override
    public User findByUsername(String username) {
        return userRepository.findByUsername(username).orElseThrow(
                () -> new RuntimeException("User not found")
        );
    }

    // Load user by username and convert to UserDetails
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username).orElseThrow(
                () -> new UsernameNotFoundException("User not found")
        );

        return new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(), rolesToAuthorities(user.getRoles()));
    }

    // Convert roles to authorities
    private Collection<? extends GrantedAuthority> rolesToAuthorities(Collection<Role> roles) {
        return roles.stream().map(role -> new SimpleGrantedAuthority(role.getRoleName())).collect(Collectors.toList());
    }

    @Override
    public List<UserResponse> getAllUsers() {
        checkAdminRole();
        List<User> users = userRepository.findAll();
        List<UserResponse> userResponses = new ArrayList<>();
        for (User user : users) {
            userResponses.add(convertToDto(user));
        }
        return userResponses;
    }

    private UserResponse convertToDto(User user) {
        UserResponse dto = new UserResponse();
        dto.setId(user.getUserId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setGender(user.getGender());
        dto.setRole(
                user.getRoles()
                        .stream()
                        .map(Role::getRoleName)
                        .collect(Collectors.joining(","))
        );
        return dto;
    }

    @Override
    public UserResponse getUserById(Long id) {
        checkAdminRole();
        return convertToDto(userRepository.findById(id).orElseThrow(
                () -> new UserNotFoundException("Không tìm thấy người dùng với id: "+ id)
        ));
    }



    //    public UserResponse updateUser(Long id, UserRequest userRequest) {
//        checkAdminRole();
//        User user = userRepository.findById(id)
//                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy người dùng với ID: " + id));
//
//        user.setUsername(userRequest.getUsername());
//        user.setEmail(userRequest.getEmail());
//        user.setFirstName(userRequest.getFirstName());
//        user.setLastName(userRequest.getLastName());
//        user.setGender(userRequest.getGender());
//        user.setRole(userRequest.getRole());
//
//        User updatedUser = userRepository.save(user);
//        return convertToDto(updatedUser);
//    }
//
//    public void deleteUser(Long id) {
//        checkAdminRole();
//        userRepository.deleteById(id);
//    }
//

//
//    public Optional<UserResponse> getUserByUsername(String username) {
//        return userRepository.findByUsername(username).map(this::convertToDto);
//    }

    @Override
    public UserResponse getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() ||
                authentication instanceof AnonymousAuthenticationToken) {
            throw new UnauthorizedException("Bạn chưa đăng nhập hoặc token không hợp lệ.");
        }

        String username = authentication.getName();

        return convertToDto(userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("Không tìm thấy người dùng.")));
    }

    private void checkAdminRole() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin) {
            throw new AccessDeniedException("Bạn không có quyền quản lý người dùng. Chỉ admin mới được phép.");
        }
    }
}

