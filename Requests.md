# Register user with avatar
curl -X POST http://localhost:3000/users \
  -F "file=@/absolute/path/to/avatar.jpg" \
  -F "name=Alice" \
  -F "email=alice@example.com" \
  -F "password=secret123" \
  -F "type=regular"