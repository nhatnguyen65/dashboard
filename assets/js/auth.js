const API_URL = "http://localhost:7000/admins"; // Mock API JSON Server
const app = document.querySelector("main");

// Kiểm tra đăng nhập
function isLoggedIn() {
    return !!sessionStorage.getItem("admin_token");
}

// Hiển thị modal login
async function showLoginModal() {
    // Nếu modal chưa có trong DOM thì fetch và gắn vào body
    if (!document.querySelector("#loginModal")) {
        try {
            const res = await fetch("../../components/login-modal.render.html");
            if (!res.ok) throw new Error(`Không tải được modal: ${res.status}`);
            const html = await res.text();
            document.body.insertAdjacentHTML("beforeend", html);
            bindLoginEvents();
        } catch (err) {
            console.error("Lỗi tải modal:", err);
            return;
        }
    }

    // Khởi tạo và hiển thị modal Bootstrap
    const modalEl = document.getElementById("loginModal");
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    modal.show();
}

// Xử lý sự kiện đăng nhập
function bindLoginEvents() {
    const form = document.querySelector("#login-form");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const username = form.username.value.trim();
        const password = form.password.value.trim();

        try {
            const res = await fetch(
                `${API_URL}?username=${username}&password=${password}`
            );
            const users = await res.json();

            if (users.length > 0 && users[0].role === "admin") {
                // Lưu token đăng nhập
                sessionStorage.setItem("admin_token", "mock_token_123");

                // Ẩn modal
                const modalEl = document.getElementById("loginModal");
                const modal = bootstrap.Modal.getInstance(modalEl);
                modal.hide();

                app.style.visibility = "visible";
                app.style.overflow = "auto";

                // Cập nhật UI (hoặc gọi hàm khởi tạo dashboard)
                document.dispatchEvent(new CustomEvent("admin-logged-in"));
            } else {
                alert("Sai tài khoản, mật khẩu hoặc không có quyền truy cập!");
            }
        } catch (err) {
            console.error("Lỗi đăng nhập:", err);
            alert("Không thể kết nối đến server!");
        }
    });
}

// Hàm tự khởi động (auto-run)
(async function initAuth() {
    // Đảm bảo DOM có sẵn (dù chạy trên bất kỳ thiết bị nào)
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", checkAuth);
    } else {
        checkAuth();
    }
})();

// Hàm kiểm tra đăng nhập mỗi lần truy cập
async function checkAuth() {
    if (!isLoggedIn()) {
        app.style.visibility = "hidden"; // Ẩn nội dung trang
        app.style.overflow = "hidden"; // Khóa cuộn
        await showLoginModal();
    } else {
        // Nếu cần, emit event để các module khác biết là admin đã login
        document.dispatchEvent(new CustomEvent("admin-logged-in"));
    }
}
