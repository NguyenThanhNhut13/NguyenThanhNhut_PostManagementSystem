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
import vn.edu.iuh.fit.backend.model.User;

public interface UserService extends UserDetailsService {
    User findByUsername(String username);
}
