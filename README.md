# blog-api-alt-school

# blogapi

## To run locally

- npm install
- npm run server

## packages version

    npm: "^18.1.2"
    node:  "^16.13.2"
    bcryptjs: "^2.4.3"
    body-parser: "^1.20.1"
    cors: "^2.8.5"
    dotenv: "^16.0.3"
    ejs: "^3.1.8"
    express: "^4.18.2"
    express-session: "^1.17.3"
    express-validator: "^5.3.1"
    jsonwebtoken: "^8.5.1"
    mongoose: "^6.7.1"

## Endpoints

### base url

https://blogapi-davies.herokuapp.com/api/v1

- signup: /user/signup
- login: /user/signin
- create_blog: /blogs
- get_all_blogs: /blogs/all
- get_published_blogs: /blogs?status=published
- get_drafted_blogs: /blogs?status=draft
- update_a_blog_by_id: /blogs/update/776666776666
- delete_a_blog_by_id: /blogs/delete/97687878788789

### ejs routes

- signup: https://blogapi-davies.herokuapp.com
- login: https://blogapi-davies.herokuapp.com/login
- blogs: https://blogapi-davies.herokuapp.com/blogs
- create blogs: https://blogapi-davies.herokuapp.com/new/blog
