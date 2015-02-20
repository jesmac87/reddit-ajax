var app = angular.module('reddit');

app.controller('PostsController', function($scope, FirebaseService) {



    $scope.getPosts = function() {
        FirebaseService.getFirebasePosts().then(function(posts) {
            $scope.posts = posts;

        });

    };

    $scope.getPosts();

    $scope.addPost = function() {

        FirebaseService.addFirebasePost($scope.newPost).then(function() {
            $scope.getPosts();
            $scope.newPost = {};
        });
    };

    $scope.vote = function(postId, direction) {

        FirebaseService.vote(postId, direction, $scope.posts[postId].karma).then(function() {
            $scope.getPosts();
        });
    };

    $scope.submitComment = function(postId, comment) {

        var commentObj = {};
        commentObj.text = comment;
        commentObj.timestamp = Date.now();

        FirebaseService.addComment(postId, commentObj).then(function() {
            $scope.getPosts();
        });
    };

});
