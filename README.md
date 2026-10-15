# OCodesdeploy

Nền tảng quản lý triển khai nhiều dự án, xây dựng theo từng giai đoạn trên Cloudflare và GitHub.

## Trạng thái hiện tại

Đây là bộ khung khởi đầu, **chưa phải dịch vụ hosting đã triển khai**. Giao diện dashboard là nền móng UI; API Worker cung cấp health check và endpoint mẫu. Chưa có xác thực người dùng, quy trình build/deploy tự động, sandbox chạy code tùy ý hoặc kết nối Cloudflare account.

## Cấu trúc

- `public/`: dashboard frontend tĩnh.
- `worker/`: Cloudflare Worker API.
- `db/migrations/`: schema D1.
- `wrangler.jsonc`: cấu hình triển khai; cần điền D1 database ID trước khi deploy.

## Chạy API cục bộ

1. Cài Node.js LTS và npm.
2. Chạy `npm install`.
3. Chạy `npm run dev`.
4. Mở `http://localhost:8787/api/health`.

## Thiết lập D1

1. Tạo database tên `ocodesdeploy-db` trong Cloudflare.
2. Thay `REPLACE_WITH_D1_DATABASE_ID` trong `wrangler.jsonc` bằng ID thật.
3. Chạy `npx wrangler d1 migrations apply ocodesdeploy-db --local` để thử local.
4. Khi đã đăng nhập Cloudflare CLI, chạy `npx wrangler d1 migrations apply ocodesdeploy-db --remote`.
5. Chạy `npm run deploy`.

Không đưa API token hoặc secret vào Git. Dùng `npx wrangler secret put SECRET_NAME` để lưu secret.

## Lộ trình

1. Dashboard và API nền tảng.
2. Đăng nhập, phân quyền và lưu project metadata vào D1.
3. Kết nối GitHub OAuth/App và triển khai Pages/Workers.
4. Logs, biến môi trường, tên miền và quản lý file R2.
5. AI code assistant và sandbox biệt lập có giới hạn tài nguyên.

## Giới hạn bảo mật

Không chạy mã không tin cậy trực tiếp trong Worker API. Sandbox cần được cô lập riêng và không được cấp secrets của nền tảng.
