import { existsSync } from "node:fs";
import { join } from "node:path";
import { execSync } from "node:child_process";

const packages = ["server", "client"];
const steps = ["lint", "typecheck", "test", "build"];

console.log("\n========================================");
console.log("   EduReach Monorepo Verification");
console.log("========================================\n");

let ranAny = false;

for (const pkg of packages) {
  const pkgJsonPath = join(pkg, "package.json");
  if (!existsSync(pkgJsonPath)) {
    console.log(`ℹ Skipping '${pkg}' (no package.json found)`);
    continue;
  }

  ranAny = true;
  console.log(`\n----------------------------------------`);
  console.log(`  Verifying package: ${pkg}`);
  console.log(`----------------------------------------\n`);

  for (const step of steps) {
    console.log(`\n▶ [${pkg}] Running step: ${step}`);
    try {
      execSync(`npm --prefix ${pkg} run ${step} --if-present`, {
        stdio: "inherit",
      });
      console.log(`✔ [${pkg}] Step passed: ${step}`);
    } catch {
      console.error(`\n✖ [${pkg}] Step failed: ${step}`);
      process.exit(1);
    }
  }
}

if (!ranAny) {
  console.log("✔ No package.json found in server or client yet. Verification passed.\n");
} else {
  console.log("\n========================================");
  console.log("   ✔ All verification checks passed!");
  console.log("========================================\n");
}
