/*
 * @ (#) UserResponse.java       1.0     11/09/2025
 *
 * Copyright (c) 2025 IUH. All rights reserved.
 */

package vn.edu.iuh.fit.backend.dto.response;
/*
 * @description:
 * @author: Nguyen Thanh Nhut
 * @date: 11/09/2025
 * @version:    1.0
 */

import lombok.Data;

@Data
public class UserResponse {
    private Long id;
    private String username;
    private String firstName;
    private String lastName;
}