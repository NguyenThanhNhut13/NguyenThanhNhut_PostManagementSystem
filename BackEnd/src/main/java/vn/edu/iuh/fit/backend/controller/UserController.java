/*
 * @ (#) UserController.java       1.0     11/09/2025
 *
 * Copyright (c) 2025 IUH. All rights reserved.
 */

package vn.edu.iuh.fit.backend.controller;
/*
 * @description:
 * @author: Nguyen Thanh Nhut
 * @date: 11/09/2025
 * @version:    1.0
 */

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.edu.iuh.fit.backend.dto.request.UpdateUserRequest;
import vn.edu.iuh.fit.backend.dto.response.BaseResponse;
import vn.edu.iuh.fit.backend.dto.response.UserResponse;
import vn.edu.iuh.fit.backend.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<?> getAllUsers() {
        List<UserResponse> users = userService.getAllUsers();
        return ResponseEntity.ok(
                new BaseResponse<>(true, "Lấy danh sách người dùng thành công!", users)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        UserResponse response =  userService.getUserById(id);

        return ResponseEntity.ok(
                new BaseResponse<>(true, "Lấy thông tin người dùng thành công!", response)
        );
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        UserResponse response =  userService.getCurrentUser();

        return ResponseEntity.ok(
                new BaseResponse<>(true, "Lấy thông tin người dùng thành công!", response)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(
                new BaseResponse<>(true, "Xóa người dùng thành công!", null)
        );
    }

}
