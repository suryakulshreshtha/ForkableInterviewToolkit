# Part D — The Wider Ecosystem

Git and GitHub Actions are two pieces of a larger toolchain. This chapter maps the rest and — more importantly — explains **how each one connects back to Git**, because that connection is what interviewers actually probe.

---

## The mental map

```
   YOU WRITE CODE
         │
         ▼
   ┌───────────┐
   │    GIT    │  version control (local)
   └─────┬─────┘
         │ push
         ▼
   ┌───────────┐
   │  GITHUB   │  remote host + collaboration
   └─────┬─────┘
         │ triggers
         ▼
   ┌───────────────────────────────────┐
   │      CI/CD PLATFORM               │  Actions · Jenkins · GitLab CI
   └─────┬─────────────────────────────┘
         │ orchestrates
         ├──► BUILD TOOL       Maven · Gradle · npm · pip
         ├──► CONTAINER        Docker
         ├──► QUALITY GATES    SonarQube · linters · coverage
         ├──► TEST REPORTING   Allure · JUnit XML
         └──► ARTIFACT STORE   Nexus · Artifactory · GH Packages
                     │
                     ▼
              DEPLOY  (Kubernetes · Terraform · Ansible)
```

**Everything downstream is triggered by a Git event.** That's the through-line: Git isn't just file history — it's the *event source* for the entire delivery pipeline. A commit hash is the identifier that ties source, build, container image, and deployment together.

---

## Docker

### What problem it solves

[Blocker Case B-6](02-blocker-cases.md#b-6-no-space-left-on-device) was a "my machine" failure. Docker is the industrial answer to that whole category: package the app *and* its environment into one image that runs identically everywhere.

| Concept | Analogy | Git parallel |
|---|---|---|
| **Dockerfile** | Recipe | Source code — committed |
| **Image** | Built cake | A tagged commit — immutable |
| **Container** | Slice being eaten | A checked-out working copy |
| **Registry** | Bakery shop | GitHub — where you push/pull |

### Dockerfile for the Python project here

```dockerfile
FROM mcr.microsoft.com/playwright/python:v1.47.0-jammy

WORKDIR /app

# Copy dependency file FIRST -- see layer caching below
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["pytest", "framework/tests", "-v"]
```

### Layer caching — the bit that matters

Each instruction creates a layer. Docker reuses cached layers until something changes, then rebuilds everything after it.

That's why `COPY requirements.txt` comes **before** `COPY . .`:

| Order | Edit a test file → |
|---|---|
| ✅ deps copied first | Dependency layer cached, install skipped |
| ❌ `COPY . .` first | Cache busted, full reinstall every time |

Same principle as [caching in CI](03-cicd-fundamentals.md#6-caching): key on the thing that changes rarely.

### Everyday commands

| Task | macOS / Linux | Windows (PowerShell) |
|---|---|---|
| Build | `docker build -t my-tests .` | same |
| Run | `docker run --rm my-tests` | same |
| Interactive shell | `docker run -it --rm my-tests bash` | same |
| List images | `docker images` | same |
| Remove unused | `docker system prune -a` | same |
| Mount current dir | `docker run -v "$(pwd)":/app my-tests` | `docker run -v ${PWD}:/app my-tests` |

> **Reclaiming disk:** `docker system prune -a` frees gigabytes. Relevant if you hit [B-6](02-blocker-cases.md#b-6-no-space-left-on-device) — Docker layers are a classic hidden space consumer.

### `.dockerignore`

Same idea as `.gitignore`, different target:

```
node_modules
.venv
.git
test-results
playwright-report
```

Without it, `COPY . .` drags `node_modules` and `.git` into the image — slow builds, bloated images, and potentially secrets from Git history.

### In CI

```yaml
- name: Build and test in container
  run: |
    docker build -t my-tests .
    docker run --rm my-tests
```

### 💬 Interview angle

> **"Why containerise a test suite?"**
>
> Environment parity. The suite needs a specific Python version, Playwright version, and system libraries for browsers — a container pins all of it, so local runs and CI runs are genuinely identical. It also makes the browser dependencies someone else's problem, since Playwright ships official images with them preinstalled.

---

## Build tools

Every ecosystem has one. They do the same three jobs: **resolve dependencies, compile/package, run tests.**

| | Maven | Gradle | npm | pip |
|---|---|---|---|---|
| Language | Java | Java/Kotlin | JS/TS | Python |
| Manifest | `pom.xml` | `build.gradle` | `package.json` | `requirements.txt` |
| Lockfile | (versions in pom) | `gradle.lockfile` | `package-lock.json` | pinned `==` / `poetry.lock` |
| Install | `mvn install` | `gradle build` | `npm ci` | `pip install -r` |
| Test | `mvn test` | `gradle test` | `npm test` | `pytest` |
| Cache dir | `~/.m2` | `~/.gradle` | `~/.npm` | `~/.cache/pip` |

### Maven, since QA roles still ask

Java automation (Selenium + TestNG) remains common, so Maven appears in interviews even for Python/TS candidates.

```xml
<dependencies>
  <dependency>
    <groupId>org.seleniumhq.selenium</groupId>
    <artifactId>selenium-java</artifactId>
    <version>4.25.0</version>
  </dependency>
</dependencies>
```

**Lifecycle phases run in order** — a common exam question:

```
validate → compile → test → package → verify → install → deploy
```

`mvn package` implicitly runs `validate`, `compile`, and `test` first.

| Command | Does |
|---|---|
| `mvn clean test` | Wipe `target/`, then run tests |
| `mvn clean install` | Build + install to local `~/.m2` |
| `mvn test -Dtest=LoginTest` | Single test class |
| `mvn -B verify` | Batch mode — **use this in CI** (no interactive prompts) |

### The Git connection

All of them read a **committed** manifest. `pom.xml`, `package.json`, and `requirements.txt` are version-controlled precisely so that a given commit produces a reproducible build. That's the same reproducibility argument as [`npm ci`](03-cicd-fundamentals.md#10-lockfiles-and-the-dependency-break).

---

## CI/CD platforms compared

| | GitHub Actions | Jenkins | GitLab CI |
|---|---|---|---|
| Hosting | SaaS (or self-hosted runners) | Self-hosted | SaaS or self-hosted |
| Config | `.github/workflows/*.yml` | `Jenkinsfile` (Groovy) | `.gitlab-ci.yml` |
| Setup | Zero | Server + plugin management | Low |
| Best for | GitHub-hosted projects | Enterprise, on-prem, legacy | GitLab shops |
| Weak spot | Vendor lock-in | Plugin/maintenance burden | Tied to GitLab |

### Jenkins, since it's still everywhere in QA

```groovy
pipeline {
    agent any
    stages {
        stage('Checkout') { steps { checkout scm } }
        stage('Install')  { steps { sh 'pip install -r requirements.txt' } }
        stage('Test')     { steps { sh 'pytest framework/tests -v' } }
    }
    post {
        always { junit 'reports/*.xml' }
    }
}
```

**Same shape as a GitHub workflow:** trigger → stages → steps → post-actions. Learn one and the second is mostly syntax.

| Concept | Actions | Jenkins |
|---|---|---|
| Config file | `workflow.yml` | `Jenkinsfile` |
| Grouping | job | stage |
| Command | `run:` | `sh` / `bat` |
| Always-run | `if: always()` | `post { always {} }` |
| Scheduling | `on: schedule:` | Build Triggers → cron |

The `Jenkinsfile` **lives in the repo**, same as a workflow file — pipeline-as-code, versioned alongside what it builds. That's the Git connection again.

---

## Quality gates & reporting

| Tool | Purpose | Wired to Git how |
|---|---|---|
| **SonarQube** | Static analysis, code smells, coverage | Scans per commit; blocks PR merge |
| **Allure** | Rich HTML test reports with history | Generated in CI, published as artifact |
| **JUnit XML** | Universal test-result format | Every CI platform parses it natively |
| **Dependabot** | Automated dependency upgrades | Opens PRs — CI validates them |
| **CodeQL** | Security scanning | Runs as a workflow, annotates PRs |

**Dependabot deserves emphasis.** It would have caught [the playwright-bdd break](03-cicd-fundamentals.md#10-lockfiles-and-the-dependency-break) as a reviewable PR with a failing check, rather than as a surprise mid-build. Enable it in Settings → Code security.

---

## Artifact registries

Where **built outputs** live — as opposed to Git, where **source** lives.

| Registry | Stores |
|---|---|
| Docker Hub / GHCR | Container images |
| npm registry | JS packages |
| PyPI | Python packages |
| Maven Central / Nexus | Java JARs |
| GitHub Packages | All of the above |

### The distinction interviewers look for

| | Git | Artifact registry |
|---|---|---|
| Holds | Source code | Built binaries |
| Unit | Commit | Versioned artifact |
| Changes | Constantly | Immutable once published |
| Identified by | SHA hash | Semantic version / tag |

**Never commit build outputs to Git.** They bloat history irreversibly and duplicate what the registry does properly. That's exactly why `node_modules/`, `.venv/`, and `playwright-report/` are in this repo's `.gitignore`.

---

## Deployment tooling (context, not depth)

| Tool | Does | Config |
|---|---|---|
| **Kubernetes** | Orchestrates containers at scale | YAML manifests |
| **Terraform** | Infrastructure as code | `.tf` files |
| **Ansible** | Configuration management | YAML playbooks |
| **Helm** | Kubernetes package manager | Charts |

QA/SDET roles rarely require depth here, but you should know the **pattern**: all of them are *declarative*, *version-controlled*, and *applied by CI*. Same philosophy as a workflow file — describe the desired state, commit it, let automation converge reality to match.

That is genuinely the whole idea behind **GitOps**: Git is the single source of truth, and automation reconciles the running system to whatever the repo says.

---

## How much do you actually need?

For a QA/SDET interview, honestly:

| Tool | Depth expected |
|---|---|
| Git | 🔴 **Deep** — daily, non-negotiable |
| GitHub Actions / Jenkins | 🟠 **Working** — read and write a pipeline |
| Docker | 🟠 **Working** — build, run, write a basic Dockerfile |
| Maven / npm / pip | 🟡 **Familiar** — run builds, read a manifest |
| SonarQube / Allure | 🟡 **Familiar** — know what they're for |
| Kubernetes / Terraform | 🟢 **Aware** — know the vocabulary |

**Don't fake depth you don't have.** "I've used Docker to containerise a test suite, but I haven't operated Kubernetes in production" is a strong, credible answer. Claiming K8s expertise and then fumbling a follow-up is much worse than admitting the boundary.

---

## 💬 Interview angles for Part D

> **"How does Docker fit into your testing workflow?"**
>
> It solves environment parity. Playwright needs specific browser system libraries, and a container pins the runtime plus those dependencies so local and CI runs are identical. In practice I use Playwright's official image as a base, copy the dependency file first for layer caching, then the source. The suite runs the same on my laptop and on a fresh runner.

> **"What's the difference between Git and an artifact registry?"**
>
> Git versions source; a registry versions built outputs. Source changes constantly and is identified by commit hash. Artifacts are immutable once published and identified by semantic version. Committing build outputs to Git bloats history permanently and duplicates what a registry does properly — that's why `node_modules` and reports are gitignored.

> **"You've only used GitHub Actions. Could you work with Jenkins?"**
>
> Yes — the concepts transfer. A `Jenkinsfile` has stages where a workflow has jobs, `sh` steps where Actions has `run`, and `post { always {} }` where Actions has `if: always()`. Both are pipeline-as-code living in the repo, triggered by commits. The syntax differs; the model doesn't.

---

**Next:** [Part E — Repo Craft](05-repo-craft.md)

[← Back to index](README.md)
