/*
 * @ (#) UpdateUserRequest.java       1.0     11/09/2025
 *
 * Copyright (c) 2025 IUH. All rights reserved.
 */

package vn.edu.iuh.fit.backend.dto.request;
/*
 * @description:
 * @author: Nguyen Thanh Nhut
 * @date: 11/09/2025
 * @version:    1.0
 */

import lombok.Data;

@Data
public class UpdateUserRequest {
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String gender;
    private String role;
}
