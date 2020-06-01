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
  - api/profile/:id/follow [put]

- component

  - api/component [post]
  - api/component [get]
  - api/component/profile/:id [get]
  - api/component/:id [get]
  - api/component/:id [delete]
  - api/component/:id/download [put]

- like

  - api/component/:id/like [put]

- rating

  - api/component/:id/rating
  - api/component/:id/rating/:id [delete]
  - api/component/:id/rating/:id [get]

  --TODO--

- messages
  - api/message/:tid [get]
  - api/message [post]
  - api/message/:id [delete]
