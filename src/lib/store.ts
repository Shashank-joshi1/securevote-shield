// Local storage based store for voting system

export interface User {
  id: string;
  username: string;
  password: string; // hashed
  role: "voter" | "admin";
  hasVoted: boolean;
}

export interface EncryptedVote {
  id: string;
  userId: string;
  encryptedCandidate: string;
  timestamp: string;
}

export const CANDIDATES = [
  { id: "c1", name: "Alice Johnson", party: "Progressive Party", color: "hsl(213, 56%, 24%)" },
  { id: "c2", name: "Bob Williams", party: "Unity Alliance", color: "hsl(152, 55%, 42%)" },
  { id: "c3", name: "Carol Davis", party: "Reform Coalition", color: "hsl(38, 92%, 50%)" },
  { id: "c4", name: "David Martinez", party: "People's Front", color: "hsl(0, 72%, 51%)" },
];

function getUsers(): User[] {
  return JSON.parse(localStorage.getItem("voting_users") || "[]");
}

function saveUsers(users: User[]) {
  localStorage.setItem("voting_users", JSON.stringify(users));
}

function getVotes(): EncryptedVote[] {
  return JSON.parse(localStorage.getItem("voting_votes") || "[]");
}

function saveVotes(votes: EncryptedVote[]) {
  localStorage.setItem("voting_votes", JSON.stringify(votes));
}

// Initialize default admin
export function initStore() {
  const users = getUsers();
  if (!users.find((u) => u.role === "admin")) {
    users.push({
      id: "admin-1",
      username: "admin",
      password: btoa("admin123"),
      role: "admin",
      hasVoted: false,
    });
    saveUsers(users);
  }
}

export function registerUser(username: string, password: string): User | string {
  const users = getUsers();
  if (users.find((u) => u.username === username)) {
    return "Username already exists";
  }
  const user: User = {
    id: crypto.randomUUID(),
    username,
    password: btoa(password),
    role: "voter",
    hasVoted: false,
  };
  users.push(user);
  saveUsers(users);
  return user;
}

export function loginUser(username: string, password: string): User | string {
  const users = getUsers();
  const user = users.find((u) => u.username === username && u.password === btoa(password));
  if (!user) return "Invalid credentials";
  return user;
}

export function markVoted(userId: string) {
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx >= 0) {
    users[idx].hasVoted = true;
    saveUsers(users);
  }
}

export function hasUserVoted(userId: string): boolean {
  const users = getUsers();
  return users.find((u) => u.id === userId)?.hasVoted ?? false;
}

export function storeEncryptedVote(userId: string, encryptedCandidate: string) {
  const votes = getVotes();
  votes.push({
    id: crypto.randomUUID(),
    userId,
    encryptedCandidate,
    timestamp: new Date().toISOString(),
  });
  saveVotes(votes);
}

export function getAllEncryptedVotes(): EncryptedVote[] {
  return getVotes();
}

export function getTotalVoters(): number {
  return getUsers().filter((u) => u.role === "voter").length;
}

export function getTotalVotesCast(): number {
  return getVotes().length;
}
