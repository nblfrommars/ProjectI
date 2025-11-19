// File: src/utils/auth.js

const MOCK_USERS_KEY = "mockUsers";
const AUTH_USER_KEY = "user";

// 🎯 Tài khoản ADMIN mặc định
const DEFAULT_ADMIN_USER = {
  id: 999,
  email: "admin@test.com", // 👈 Email/Username để đăng nhập
  password: "admin", // 👈 Mật khẩu
  role: "admin", // 👈 Vai trò: admin
};

/**
 * Khởi tạo danh sách người dùng mock (bao gồm ADMIN mặc định)
 * @returns {Array} Danh sách người dùng
 */
const getRegisteredUsers = () => {
  try {
    let users = localStorage.getItem(MOCK_USERS_KEY);
    users = users ? JSON.parse(users) : [];

    // 🎯 LOGIC BỔ SUNG: Kiểm tra xem Admin có tồn tại chưa, nếu chưa thì thêm vào
    const adminExists = users.some(
      (user) => user.email === DEFAULT_ADMIN_USER.email
    );

    if (!adminExists) {
      users.push(DEFAULT_ADMIN_USER);
      // Lưu lại để admin luôn có sẵn cho các lần sau
      localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
    }

    return users;
  } catch (e) {
    console.error("Lỗi khi đọc mockUsers từ LocalStorage:", e);
    return [DEFAULT_ADMIN_USER]; // Trả về Admin mặc định trong trường hợp lỗi
  }
};

/**
 * Hàm Đăng nhập Mock: Kiểm tra người dùng và lưu trạng thái đăng nhập.
 * @param {object} credentials - Chứa { email, password }
 * @returns {object} { success: boolean, message?: string, role?: string }
 */
export const login = ({ email, password }) => {
  // Gọi hàm này để đảm bảo ADMIN mặc định được load
  const users = getRegisteredUsers();

  // 1. Tìm người dùng khớp email và password
  const foundUser = users.find(
    (user) => user.email === email && user.password === password
  );

  if (!foundUser) {
    return { success: false, message: "Email hoặc mật khẩu không đúng." };
  }

  // 2. Đăng nhập thành công: Lưu thông tin cần thiết vào LocalStorage
  localStorage.setItem(
    AUTH_USER_KEY,
    JSON.stringify({
      email: foundUser.email,
      role: foundUser.role,
    })
  );

  // 3. Trả về kết quả để Login.jsx điều hướng
  return { success: true, role: foundUser.role };
};

/**
 * Hàm Đăng ký Mock: Lưu người dùng mới vào LocalStorage.
 * ... (Phần code register giữ nguyên) ...
 */
export const register = ({ email, password }) => {
  // Vẫn gọi getRegisteredUsers để đảm bảo danh sách được load
  const users = getRegisteredUsers();

  // Kiểm tra email đã tồn tại chưa
  const userExists = users.some((user) => user.email === email);
  if (userExists) {
    return {
      success: false,
      message: "Email đã được đăng ký. Vui lòng sử dụng email khác.",
    };
  }

  const newUser = {
    id: Date.now(),
    email,
    password,
    role: "user",
  };

  users.push(newUser);
  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));

  return { success: true, message: "Đăng ký thành công!" };
};

/**
 * Hàm đăng xuất
 */
export const logout = () => {
  // Xóa trạng thái đăng nhập
  localStorage.removeItem(AUTH_USER_KEY);
  // Lưu ý: Không xóa MOCK_USERS_KEY để các tài khoản đã đăng ký vẫn còn
};
