/*
 * @ (#) AuthService.java       1.0     10/09/2025
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

import vn.edu.iuh.fit.backend.dto.request.LoginRequest;
import vn.edu.iuh.fit.backend.dto.request.RegisterRequest;
import vn.edu.iuh.fit.backend.dto.response.JwtResponse;
import vn.edu.iuh.fit.backend.dto.response.RegisterResponse;

public interface AuthService {
    RegisterResponse registerNewUser(RegisterRequest request);
    JwtResponse login(LoginRequest request);
}
