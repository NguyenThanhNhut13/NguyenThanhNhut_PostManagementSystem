/*
 * @ (#) PostResponse.java       1.0     10/09/2025
 *
 * Copyright (c) 2025 IUH. All rights reserved.
 */

package vn.edu.iuh.fit.backend.dto.response;
/*
 * @description:
 * @author: Nguyen Thanh Nhut
 * @date: 10/09/2025
 * @version:    1.0
 */

import lombok.Data;

import java.util.Date;

@Data
public class PostResponse {
    private Long id;
    private String title;
    private String content;
    private UserResponse author;
    private Date createdAt;
    private Date updatedAt;
}