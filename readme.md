# Reactor

- user

  - api/auth [post]
  - api/user [post]

- profile

  - api/profile/me [get]
  - api/profile [get]
  - api/profile/:id [get]
  - api/profile [post]
  - api/profile/:id [delete]

- component
  - api/component [post]
  - api/component [get]
  - api/component/profile/:id [get]
  - api/component/:id [get]
  - api/component/:id [delete]
  - api/component/:id [put]

- like
  - api/component/:id/like [put]
  - api/component/:id/unlike [put]

- rating
  - api/component/:id/rating [get]
  - api/component/:id/rating/:id [delete]
  - api/component/:id/rating/:id [get]

  --TODO--
  - api/component/:id/rating [post] review
  - api/component/:id/rating/:id [put] not done
