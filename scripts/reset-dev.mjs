import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const lockPath = path.join(".next", "dev", "lock");

/**
 * 停止占用端口的旧 Next.js dev 进程并清理 lock 文件
 */
function resetDevServer() {
  if (!fs.existsSync(lockPath)) {
    console.log("未发现 dev lock，无需清理。");
    return;
  }

  const lock = JSON.parse(fs.readFileSync(lockPath, "utf8"));

  if (lock.pid) {
    try {
      if (process.platform === "win32") {
        execSync(`taskkill /PID ${lock.pid} /F`, { stdio: "ignore" });
      } else {
        process.kill(lock.pid, "SIGTERM");
      }
      console.log(`已停止旧 dev 进程 PID ${lock.pid}`);
    } catch {
      console.log(`进程 PID ${lock.pid} 已不存在，跳过终止。`);
    }
  }

  fs.unlinkSync(lockPath);
  console.log("已清理 .next/dev/lock，可以重新运行 npm run dev。");
}

resetDevServer();
