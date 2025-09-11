/*
 * @ (#) UserService.java       1.0     10/09/2025
 *
 * Copyright (c) 2025 IUH. All rights reserved.
 */

package vn.edu.iuh.fit.backend.service;
/*
 * @description:
 * @author: Nguyen Thanh Nhut
 * @date: 10/09/2025
 * @version:    1.0
 */

import org.springframework.security.core.userdetails.UserDetailsService;
import vn.edu.iuh.fit.backend.dto.response.UserResponse;
import vn.edu.iuh.fit.backend.model.User;

import java.util.List;

public interface UserService extends UserDetailsService {
    User findByUsername(String username);
    List<UserResponse> getAllUsers();
    UserResponse getUserById(Long id);
    UserResponse getCurrentUser();
}
