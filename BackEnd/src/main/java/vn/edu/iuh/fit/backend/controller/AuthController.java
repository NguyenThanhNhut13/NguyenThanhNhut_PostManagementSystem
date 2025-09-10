/*
 * @ (#) AuthController.java       1.0     10/09/2025
 *
 * Copyright (c) 2025 IUH. All rights reserved.
 */

package vn.edu.iuh.fit.backend.controller;
/*
 * @description:
 * @author: Nguyen Thanh Nhut
 * @date: 10/09/2025
 * @version:    1.0
 */

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.edu.iuh.fit.backend.dto.request.LoginRequest;
import vn.edu.iuh.fit.backend.dto.request.RegisterRequest;
import vn.edu.iuh.fit.backend.dto.response.BaseResponse;
import vn.edu.iuh.fit.backend.dto.response.JwtResponse;
import vn.edu.iuh.fit.backend.dto.response.RegisterResponse;
import vn.edu.iuh.fit.backend.service.AuthService;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest request) {
        RegisterResponse response = authService.registerNewUser(request);
        return ResponseEntity.ok(
                new BaseResponse<>(true, "Đăng ký người dùng thành công!", response)
        );
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest request) {
        JwtResponse response = authService.login(request);
        return ResponseEntity.ok(
                new BaseResponse<>(true, "Đăng nhập thành công!", response)
        );
    }
}
