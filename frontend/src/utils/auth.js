const MOCK_USERS_KEY = "mockUsers";
const AUTH_USER_KEY = "user";

//tai khoan admin
const DEFAULT_ADMIN_USER = {
  id: 999,
  email: "admin@test.com",
  password: "admin",
  role: "admin",
};

/**
 * Khoi tao danh sach nguoi dung
 * @returns {Array} List nguoi dung
 */
const getRegisteredUsers = () => {
  try {
    let users = localStorage.getItem(MOCK_USERS_KEY);
    users = users ? JSON.parse(users) : [];

    // Kiem tra admin da ton tai chua, neu khong thi them
    const adminExists = users.some(
      (user) => user.email === DEFAULT_ADMIN_USER.email
    );

    if (!adminExists) {
      users.push(DEFAULT_ADMIN_USER);
      //luu vao localStorage
      localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
    }

    return users;
  } catch (e) {
    console.error("Lỗi khi đọc mockUsers từ LocalStorage:", e);
    return [DEFAULT_ADMIN_USER];
  }
};

//ham dang nhap mock
export const login = ({ email, password }) => {
  // Dam bao load admin
  const users = getRegisteredUsers();

  // Tim nguoi dung
  const foundUser = users.find(
    (user) => user.email === email && user.password === password
  );

  if (!foundUser) {
    return { success: false, message: "Email hoặc mật khẩu không đúng." };
  }

  // dang nhap thanh cong thi luu vao local storage
  localStorage.setItem(
    AUTH_USER_KEY,
    JSON.stringify({
      email: foundUser.email,
      role: foundUser.role,
    })
  );

  // Tra ket qua de dieu huong
  return { success: true, role: foundUser.role };
};

//mock tao nguoi dung
export const register = ({ email, password }) => {
  // Goi de dam bao danh sach nguoi dung da duoc load
  const users = getRegisteredUsers();

  // Kiem tra email ton tai chua
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
 * Ham dang xuat
 */
export const logout = () => {
  // xoa dang nhap di
  localStorage.removeItem(AUTH_USER_KEY);
};
