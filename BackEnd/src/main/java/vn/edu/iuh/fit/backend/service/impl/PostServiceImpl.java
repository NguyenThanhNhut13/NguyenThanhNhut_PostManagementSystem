/*
 * @ (#) PostServiceImpl.java       1.0     10/09/2025
 *
 * Copyright (c) 2025 IUH. All rights reserved.
 */

package vn.edu.iuh.fit.backend.service.impl;
/*
 * @description:
 * @author: Nguyen Thanh Nhut
 * @date: 10/09/2025
 * @version:    1.0
 */

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import vn.edu.iuh.fit.backend.dto.request.CreatePostRequest;
import vn.edu.iuh.fit.backend.dto.request.UpdatePostRequest;
import vn.edu.iuh.fit.backend.dto.response.PaginatedPostsResponse;
import vn.edu.iuh.fit.backend.dto.response.PostResponse;
import vn.edu.iuh.fit.backend.dto.response.UserResponse;
import vn.edu.iuh.fit.backend.exception.AccessDeniedException;
import vn.edu.iuh.fit.backend.exception.PostNotFoundException;
import vn.edu.iuh.fit.backend.exception.UnauthorizedException;
import vn.edu.iuh.fit.backend.exception.UserNotFoundException;
import vn.edu.iuh.fit.backend.model.Post;
import vn.edu.iuh.fit.backend.model.User;
import vn.edu.iuh.fit.backend.repository.PostRepository;
import vn.edu.iuh.fit.backend.repository.UserRepository;
import vn.edu.iuh.fit.backend.service.PostService;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;

    @Override
    public PostResponse createPost(CreatePostRequest postRequest) {
        User author = getCurrentUser();

        Post post = new Post();
        post.setTitle(postRequest.getTitle());
        post.setContent(postRequest.getContent());
        post.setAuthor(author);
        Post newPost = postRepository.save(post);
        return convertToDto(newPost);
    }

    @Override
    public PostResponse updatePost(Long postId, UpdatePostRequest postDetails) {
        User currentUser = getCurrentUser();

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new PostNotFoundException("Không tìm thấy bài viết với ID: " + postId));

        if (!post.getAuthor().getUserId().equals(currentUser.getUserId())) {
            throw new AccessDeniedException("Bạn không có quyền chỉnh sửa bài viết này.");
        }

        post.setTitle(postDetails.getTitle());
        post.setContent(postDetails.getContent());
        Post updatedPost = postRepository.save(post);
        return convertToDto(updatedPost);
    }

    @Override
    public PaginatedPostsResponse getAllPosts(int page, int size, String sortBy, String direction, boolean myPosts) {
        User user = getCurrentUser();

        Sort sort = Sort.by(Sort.Direction.fromString(direction), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Post> postPage;
        if (myPosts) {
            postPage = postRepository.findByAuthor(user, pageable);
        } else {
            postPage = postRepository.findAll(pageable);
        }

        List<PostResponse> posts = postPage.getContent().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

        PaginatedPostsResponse response = new PaginatedPostsResponse();
        response.setPosts(posts);
        response.setCurrentPage(postPage.getNumber());
        response.setTotalPages(postPage.getTotalPages());
        response.setTotalElements(postPage.getTotalElements());
        response.setHasNext(postPage.hasNext());
        response.setHasPrevious(postPage.hasPrevious());

        return response;
    }

    @Override
    public PostResponse getPostById(Long postId) {
        getCurrentUser();

        Optional<Post> post = postRepository.findById(postId);
        if (post.isEmpty()) {
            throw new PostNotFoundException("Không tìm thấy bài viết");
        }
        return convertToDto(post.get());
    }

    @Override
    public void deletePost(Long postId) {
        User currentUser = getCurrentUser();

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new PostNotFoundException("Không tìm thấy bài viết với ID: " + postId));

        if (!post.getAuthor().getUserId().equals(currentUser.getUserId())) {
            throw new AccessDeniedException("Bạn không có quyền xóa bài viết này.");
        }

        postRepository.delete(post);
    }

    private PostResponse convertToDto(Post post) {
        PostResponse dto = new PostResponse();
        dto.setId(post.getId());
        dto.setTitle(post.getTitle());
        dto.setContent(post.getContent());
        dto.setAuthor(convertToUserResponse(post.getAuthor()));
        dto.setCreatedAt(post.getCreatedAt());
        dto.setUpdatedAt(post.getUpdatedAt());
        return dto;
    }

    private UserResponse convertToUserResponse(User user) {
        UserResponse userResponse = new UserResponse();
        userResponse.setId(userResponse.getId());
        userResponse.setUsername(user.getUsername());
        userResponse.setFirstName(user.getFirstName());
        userResponse.setLastName(user.getLastName());
        return userResponse;
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() ||
                authentication instanceof AnonymousAuthenticationToken) {
            throw new UnauthorizedException("Bạn chưa đăng nhập hoặc token không hợp lệ.");
        }

        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("Không tìm thấy người dùng."));
    }

}
