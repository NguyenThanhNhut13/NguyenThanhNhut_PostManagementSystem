/*
 * @ (#) PostService.java       1.0     10/09/2025
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

import vn.edu.iuh.fit.backend.dto.request.CreatePostRequest;
import vn.edu.iuh.fit.backend.dto.request.UpdatePostRequest;
import vn.edu.iuh.fit.backend.dto.response.PaginatedPostsResponse;
import vn.edu.iuh.fit.backend.dto.response.PostResponse;

public interface PostService {
    PostResponse createPost(CreatePostRequest postRequest);
    PostResponse updatePost(Long postId, UpdatePostRequest postDetails);
    PaginatedPostsResponse getAllPosts(int page, int size, String sortBy, String direction, boolean myPosts);
    PostResponse getPostById(Long postId);
    void deletePost(Long postId);
}
