# Glossary

One line per term. Skim before an interview.

## Git

| Term | Meaning |
|---|---|
| **Repository (repo)** | A project plus its full history — the hidden `.git` folder |
| **Working directory** | Your files as they exist on disk right now |
| **Staging area / index** | Changes selected for the next commit (`git add` puts them here) |
| **Commit** | An immutable snapshot, identified by a SHA hash |
| **HEAD** | Pointer to your current commit/branch |
| **Branch** | A movable pointer to a commit — cheap, just a label |
| **Remote** | A hosted copy; `origin` is the conventional nickname |
| **Upstream** | The remote branch your local branch tracks |
| **Clone** | Full local copy of a remote repo, history included |
| **Fetch** | Download remote changes *without* applying them |
| **Pull** | Fetch + merge (or rebase) |
| **Push** | Upload your commits to the remote |
| **Merge** | Combine branches, creating a merge commit |
| **Rebase** | Replay your commits on top of another branch — linear history |
| **Conflict** | Two commits changed the same lines; Git needs you to choose |
| **Stash** | Shelve uncommitted changes temporarily |
| **Tag** | A permanent label on a commit, usually a version |
| **Fork** | Your own server-side copy of someone else's repo |
| **Pull Request (PR)** | A request to merge, with review and CI attached |
| **Detached HEAD** | Sitting on a commit rather than a branch |
| **Reflog** | Log of where HEAD has been — your undo history |
| **Dangling object** | Unreferenced object awaiting garbage collection — harmless |
| **Cherry-pick** | Copy one commit onto another branch |
| **Squash** | Combine several commits into one |
| **`.gitignore`** | Patterns for files Git should not track |
| **Monorepo** | Multiple projects in one repository — like this one |

## CI/CD

| Term | Meaning |
|---|---|
| **CI** | Continuous Integration — auto build + test on every push |
| **CD (Delivery)** | Every passing build is *ready* to ship; human approves |
| **CD (Deployment)** | Every passing build ships automatically |
| **Pipeline** | The full automated sequence from commit to deploy |
| **Workflow** | One YAML file defining a pipeline in GitHub Actions |
| **Job** | A unit of work on its own fresh VM |
| **Step** | One command or action within a job |
| **Runner** | The machine executing a job |
| **Action** | A reusable step from the marketplace |
| **Artifact** | A file produced by a job and kept after it ends |
| **Matrix** | Run the same job across multiple configurations |
| **Path filter** | Only trigger a workflow when matching files change |
| **Secret** | Encrypted value injected at runtime, masked in logs |
| **Branch protection** | Rules that block merging until conditions are met |
| **Status check** | A CI result attached to a commit or PR |
| **Concurrency group** | Cancels superseded runs of the same workflow |
| **`workflow_dispatch`** | Manual "Run workflow" trigger |
| **Lockfile** | Records exact dependency versions for reproducibility |
| **`npm ci`** | Install from lockfile — reproducible; use in CI |
| **Fail-fast** | Cancel sibling matrix jobs on first failure |
| **Flaky test** | Passes and fails without code changes |
| **Quarantine** | Isolating a flaky test so it doesn't block CI |

## Ecosystem

| Term | Meaning |
|---|---|
| **Docker image** | Immutable packaged app + environment |
| **Container** | A running instance of an image |
| **Dockerfile** | Recipe for building an image |
| **Layer caching** | Reusing unchanged Docker build steps |
| **Registry** | Where images/packages are published |
| **Maven** | Java build tool; `pom.xml` |
| **Gradle** | Java/Kotlin build tool; `build.gradle` |
| **Jenkins** | Self-hosted CI server; `Jenkinsfile` |
| **SonarQube** | Static analysis and quality gates |
| **Allure** | Rich HTML test reporting |
| **JUnit XML** | Universal test-result format |
| **Dependabot** | Automated dependency-upgrade PRs |
| **Kubernetes** | Container orchestration at scale |
| **Terraform** | Infrastructure as code |
| **GitOps** | Git as the single source of truth; automation reconciles reality |
| **Semantic versioning** | MAJOR.MINOR.PATCH |

## Shell

| Term | Meaning |
|---|---|
| **zsh** | macOS default shell since Catalina |
| **bash** | Common Linux/CI default shell |
| **PowerShell** | Windows shell |
| **`$VAR`** | Use a variable's value |
| **`$(cmd)`** | Substitute a command's output |
| **`<PLACEHOLDER>`** | Documentation convention — replace it, brackets included |
| **`interactive_comments`** | zsh option enabling inline `#` comments |
| **Exit code** | 0 = success, anything else = failure |

[← Back to index](README.md)
