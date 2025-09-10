/*
 * @ (#) PostController.java       1.0     10/09/2025
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
import org.springframework.web.bind.annotation.*;
import vn.edu.iuh.fit.backend.dto.request.CreatePostRequest;
import vn.edu.iuh.fit.backend.dto.request.UpdatePostRequest;
import vn.edu.iuh.fit.backend.dto.response.BaseResponse;
import vn.edu.iuh.fit.backend.dto.response.PaginatedPostsResponse;
import vn.edu.iuh.fit.backend.dto.response.PostResponse;
import vn.edu.iuh.fit.backend.service.PostService;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @PostMapping
    public ResponseEntity<?> createPost(@RequestBody CreatePostRequest request) {
        PostResponse response = postService.createPost(request);
        return ResponseEntity.ok(
                new BaseResponse<>(true, "Tạo bài viết thành công!", response)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPostById(@PathVariable Long id) {
        PostResponse post = postService.getPostById(id);
        return ResponseEntity.ok(
                new BaseResponse<>(true, "Lấy bài viết thành công!", post)
        );
    }

    @GetMapping
    public ResponseEntity<?> getAllPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction,
            @RequestParam(defaultValue = "false", name = "my-posts") boolean myPosts) {

        PaginatedPostsResponse response = postService.getAllPosts(page, size, sortBy, direction, myPosts);

        return ResponseEntity.ok(
                new BaseResponse<>(true, "Lấy danh sách bài viết thành công!", response)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePost(@PathVariable Long id, @RequestBody UpdatePostRequest postRequest) {
        PostResponse updatedPost = postService.updatePost(id, postRequest);
        return ResponseEntity.ok(
                new BaseResponse<>(true, "Cập nhật bài viết thành công!", updatedPost)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(@PathVariable Long id) {
        postService.deletePost(id);
        return ResponseEntity.ok(
                new BaseResponse<>(true, "Xóa bài viết thành công!", null)
        );
    }


}
