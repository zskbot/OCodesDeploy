# OCodesDeploy

Nền tảng quản lý và triển khai nhiều dự án, bắt đầu từ website tĩnh + API trên Cloudflare Workers và D1.

## Trạng thái

Đây là bộ khung kỹ thuật đang được triển khai từng bước. Chưa được coi là dịch vụ hosting production cho tới khi database được tạo, migration chạy, Worker deploy và URL được kiểm tra thành công.

## Cấu trúc

- `public/`: dashboard frontend.
- `worker/index.js`: API và bộ định tuyến.
- `db/migrations/`: schema D1.
- `wrangler.jsonc`: cấu hình Worker, static assets và D1.

## Triển khai

1. Cài Node.js LTS trên máy tính hoặc môi trường phát triển.
2. Chạy `npm install`.
3. Tạo D1 database tên `ocodesdeploy-db` trong Cloudflare.
4. Sao chép ID database thật vào `wrangler.jsonc`, thay `REPLACE_WITH_D1_DATABASE_ID`.
5. Chạy migration local: `npx wrangler d1 migrations apply ocodesdeploy-db --local`.
6. Đăng nhập Wrangler: `npx wrangler login`.
7. Chạy migration remote: `npx wrangler d1 migrations apply ocodesdeploy-db --remote`.
8. Deploy: `npm run deploy`.
9. Mở URL `workers.dev` được Wrangler trả về và kiểm tra `/api/health`.

Dashboard và API được phục vụ cùng một Worker để tránh cấu hình CORS giữa hai domain.

## Bảo mật và giới hạn

- Không commit API token, mật khẩu hoặc file `.dev.vars`.
- Chưa có xác thực/ủy quyền đa người dùng; không mở các thao tác quản trị cho người dùng công khai.
- Không chạy mã người dùng không tin cậy trực tiếp trong Worker API. Sandbox cần runtime cô lập riêng, hạn mức CPU/RAM/thời gian và không được tiếp cận secrets của nền tảng.
- Workers phù hợp website/API serverless; ứng dụng cần tiến trình Node.js chạy liên tục hoặc Docker cần một runtime riêng.
