#Reddit with $http and $q

Today we are going to create an app that allows our users to create new posts, add comments, and upvote / downvote posts.

## Step 1 - Initial Setup

- Let's create the basic setup of our app by doing the following:
  - Create app.js
  - Create controller.js
  - Create service.js
  - Create style.css

All of our files should aready be linked in the prebuilt index.html file. You will also notice that the angular and bootstrap.css CDNs have been included in the index.html page.

*note we will not be using Bootstrap's JavaScript for this project*

- If we look at our index.html page, we will notice that ng-app and ng-controller are currently pointing to a controller and module that don't exist. Let's fix that.

- Go to app.js and initialize a new angular module named "reddit"
- Go to controller.js and create a new controller named "PostsController"
- Go to service.js and create a new service called "FirebaseService"
- Inject "FirebaseService" into "PostsController"

## Step 2 - Setting up the Service

For this application, let's set up our service first. Our endpoint is going to be a Firebase called "DevMtn". The url is 'https://devmtn.firebaseio.com/posts.json'. Because we are using Firebase for our API, we are going to have to do things the way firebase wants us to. To do this we will need to consult their documentation: https://www.firebase.com/docs/rest/api/

- Inject $http and $q into the FirebaseService

## Step 3 - Our first GET request

- Create a GET request in the FirebaseService using $http and $q that returns all of the posts from our Firebase
- In our controller.js file, let's create a function called getPosts() that runs our GET request in our service
- Use .then to save the response to $scope.posts
- Now $scope.posts should be properly displaying in our index.html page!

## Step 4 - Our first POST Request

Something we need to note about Firebase, is that their REST client is a little weird. One major thing we will do differently is our usage of HTTP verbs. 

Normally we use:
- POST (Create) - GET (Read) - PUT (Update) - DELETE (Destroy) 

for our CRUD operations. We are going to do things slightly different with Firebase:
- PUT (Create) - GET (Read) - PATCH (Update) - DELETE (Destroy)

This is not the norm, but it's how Firebase works in this instance. Later in the class we will learn how to use Firebase's SDK which is much nicer :) 

For our first POST (which is technically going to be a PUT) we will start in our view.

In our view we have a form, that current has 3 input fields and a submit button.

- Add ng-model to the input fields and make the model part of a newPost object:
  - ng-model="newPost.title" for example
- Add ng-click to the submit button that runs a function called addPost()
- In the controller we need to create our addPost function
  - Create a function that runs FirebaseService.addPost()
  - Pass in $scope.newPost to firebaseService.addPost()
- Go to our firebaseService and create a new function called this.addPost that takes in the post as a parameter

We are going to want to add some things to our post object other than title body and author. For instance we will want a unique id, as well as a timestamp and some other things.

- inside this.addPost(post) add a timestamp to the post:
  - post.timestamp = Date.now();
  - post.comments = [];
  - post.karma = 0;
  - post.id = guid();

The guid() function is a function that is going to generate a unique id for us.

- Paste this function into our service so that we can generate unique ids:

```` javascript
  var guid = function() {
    var s4 = function() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }
````

Now, when we pass a new post into our service, our service will add all of these things to it before it gets sent into our database. NEATO!

- Next create a http request using $http and $q that will make a PUT request to add the post to our firebase.
  - Our url is going to be slightly modified:
    - 'https://devmtn.firebaseio.com/posts/' + post.id + '.json'

This url will allow us to create new firebase objects with our own ID, that way we can access them later.

What's happening now, is our data is moving from our view into the controller, then being passed into our service, where it is edited and then put into our database.

- One last thing we should do is call our getData function in our controller once our post request has worked
  - in our controller, use .then after our firebaseService.addPost() function. Inside the callback of .then run getPosts();


Now we should be able to make new posts, and see them show up on the left hand side of the screen!



# Black Diamond


##Karma

As you may have noticed, in our service we are adding an empty array and a karma integer to our posts. In order to make it possible for users to leave comments and upvote / downvote things we will need to update our posts.

In firebase's REST api (the one we are using) they have us use an HTTP verb we don't normally use, called PATCH. PATCH is a lot like PUT, it allows us to update something that already exists.

There is some markup in our index.html file that is commented out. This is the markup that holds the karma and comment sections. 

- Un-comment the commented out code in the index.html file
- Notice how there is a funciton that will run when you click on a thumbs up or thumbs down icon. That function is called vote() and it takes in a couple things:
  - post.id
  - direction

The post.id will tell our database which post to apply the vote, and the direction will tell the vote if it should be up or down.

- Create a $scope.vote function that takes the post.id and the direction and passes it into a function called firebaseService.vote()
- In the firebaseService, create the this.vote function that takes in the post.id and the direction.
- Since karma is an integer, we can add or minus from it by saying karma++ or karma--
- Something like this should suit our needs:

```` javascript
    if(direction === 'up') {
      karma++;
    } else if(direction === 'down'){
      karma--;
    }
````

- Make sure than piece of code is inside our this.vote function
- Now make an ajax request using $http and $q to add the information to our firebase
  - Remember, our URL needs to include the id ofthe post we are affecting
  - We need to use PATCH for our method
- In our controller, we should also run the getData function much like we did in the previous step allowing our view to refresh when we make a change.

##Comments

Adding comments will be very similar to adding karma, take this time to try and make it happen sans instruction.
