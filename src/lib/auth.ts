export type User = {
  name: string;
  email: string;
  role: string;
  password?: string;
};

const USERS = "foliofit.users";
const SESSION = "foliofit.session";

const readUsers = (): User[] => {
  try {
    return JSON.parse(localStorage.getItem(USERS) || "[]");
  } catch {
    return [];
  }
};

export function signup(u: User): { ok: true } | { ok: false; error: string } {
  const users = readUsers();
  const existingIdx = users.findIndex((x) => x.email.toLowerCase() === u.email.toLowerCase());
  if (existingIdx >= 0) {
    users[existingIdx] = { ...users[existingIdx], ...u };
  } else {
    users.push(u);
  }
  localStorage.setItem(USERS, JSON.stringify(users));
  localStorage.setItem(SESSION, u.email);
  return { ok: true };
}

export function login(email: string, password?: string): { ok: true } | { ok: false; error: string } {
  const cleanEmail = email.trim();
  const users = readUsers();
  let user = users.find((x) => x.email.toLowerCase() === cleanEmail.toLowerCase());
  if (!user) {
    const namePart = cleanEmail.split("@")[0] || "User";
    const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
    user = {
      name: formattedName,
      email: cleanEmail,
      role: "Candidate",
      password: password || "password123",
    };
    users.push(user);
    localStorage.setItem(USERS, JSON.stringify(users));
  } else if (password) {
    user.password = password;
    localStorage.setItem(USERS, JSON.stringify(users));
  }
  localStorage.setItem(SESSION, user.email);
  return { ok: true };
}

export function loginSocial(provider: string) {
  const email = `${provider.toLowerCase().replace(/\s+/g, "")}.user@foliofit.dev`;
  const name = `${provider} Candidate`;
  const users = readUsers();
  let user = users.find((x) => x.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    user = { name, email, role: "Senior Candidate", password: "social_login_auth" };
    users.push(user);
    localStorage.setItem(USERS, JSON.stringify(users));
  }
  localStorage.setItem(SESSION, user.email);
}

export function demoLogin() {
  const demo: User = { name: "Alex Chen", email: "alex@foliofit.dev", role: "Senior Candidate", password: "demo1234" };
  const users = readUsers();
  if (!users.some((u) => u.email === demo.email)) {
    users.push(demo);
    localStorage.setItem(USERS, JSON.stringify(users));
  }
  localStorage.setItem(SESSION, demo.email);
}

export function currentUser(): User | null {
  const email = localStorage.getItem(SESSION);
  if (!email) return null;
  const users = readUsers();
  const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (found) return found;
  const namePart = email.split("@")[0] || "User";
  return {
    name: namePart.charAt(0).toUpperCase() + namePart.slice(1),
    email,
    role: "Candidate",
  };
}

export function logout() {
  localStorage.removeItem(SESSION);
}
