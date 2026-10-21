// All portfolio content lives here. Edit this file to add jobs, projects or skills —
// the page re-renders from it, no HTML changes needed.

export const links = {
  email: 'khamkaratharva08@gmail.com',
  linkedin: 'https://linkedin.com/in/atharva-khamkar',
  github: 'https://github.com/Atharvakhamkar',
  resume: 'assets/Atharva_Khamkar_DevOps_Resume.pdf',
};

const gh = (repo) => `${links.github}/${repo}`;

export const experience = [
  {
    role: 'DevOps Intern',
    org: 'Radical Technologies',
    place: 'India',
    when: 'Dec 2024 – May 2025',
    duration: '6 mo',
    steps: [
      'Administered <b>Red Hat Enterprise Linux</b> servers across a 6-month hands-on programme — users, groups, permissions, processes and packages (yum/dnf) — keeping multi-user systems secure and consistently configured.',
      'Secured remote access by configuring <b>SSH and firewalld</b> to allow only required services, and resolved connectivity faults with standard Linux networking tools.',
      'Replaced repetitive manual admin with <b>Bash scripts scheduled via cron</b>, so routine tasks ran consistently without operator intervention.',
      'Deployed a complete <b>LAMP stack on RHEL from a bare OS</b>: Apache virtual hosts, hardened MySQL, minimal firewall ports, validated end-to-end.',
    ],
    tags: ['RHEL', 'Bash', 'cron', 'SSH', 'firewalld', 'Apache', 'MySQL', 'PHP'],
  },
  {
    role: 'Software Engineer Intern — DevOps & Cloud',
    org: 'ScaleFull Technologies LLP',
    place: 'India',
    when: 'Dec 2023 – Jan 2024',
    duration: '2 mo',
    steps: [
      'Removed manual deployment effort by designing <b>Jenkins CI/CD pipelines with Docker</b> that automated the full build → test → deploy workflow, giving the team faster, repeatable releases.',
      'Integrated <b>SonarQube static analysis as a quality gate</b>, catching bugs and code smells before code reached deployment.',
      'Provisioned and managed <b>AWS EC2</b> for application hosting, configuring Security Groups and IAM roles to control network access and permissions.',
      'Cut LAMP and WordPress environment setup from a manual multi-step process to <b>a single automated run</b> with Ansible playbooks and Bash.',
      'Administered <b>Ubuntu and CentOS</b> servers (user management, shell scripting, troubleshooting) to keep dev environments stable.',
    ],
    tags: ['Jenkins', 'Docker', 'SonarQube', 'AWS EC2', 'IAM', 'Ansible', 'Ubuntu', 'CentOS'],
  },
];

// filter keys: cicd | k8s | cloud | obs | ai
export const projects = [
  {
    title: 'End-to-End CI/CD Pipeline',
    status: 'deployed', meta: 'Jenkins · K8s',
    img: 'assets/node-todo-cicd.png', imgAlt: 'Pipeline: GitHub → Jenkins → SonarQube → Docker → Kubernetes',
    desc: 'Replaced a manual release process with a webhook-triggered Jenkins pipeline: build, unit tests, SonarQube SAST, Docker build & push, then a rolling Kubernetes deploy. GitHub Actions PR checks act as a pre-merge gate.',
    win: '0 manual steps from commit → deploy',
    tags: ['Jenkins', 'GitHub Actions', 'SonarQube', 'Docker', 'Kubernetes', 'Terraform', 'Azure Pipelines'],
    filters: ['cicd', 'k8s', 'cloud'],
    links: [['source', gh('node-todo-cicd')]],
  },
  {
    title: '2-Tier Cloud-Native App on AWS',
    status: 'deployed', meta: 'AWS · EKS',
    img: 'assets/flask-two-tier.png', imgAlt: 'Flask → MySQL → Docker → Jenkins → EKS',
    desc: 'Flask app tier + MySQL tier behind a Load Balancer with Auto Scaling in a custom VPC. Containerised with Docker Compose, then migrated to Kubernetes/EKS with Persistent Volumes so MySQL data survives pod restarts.',
    win: '−80% environment setup time',
    tags: ['AWS VPC', 'ELB', 'Auto Scaling', 'EKS', 'Docker Compose', 'Flask', 'MySQL'],
    filters: ['cloud', 'k8s', 'cicd'],
    links: [['source', gh('flask-two-tier-application')]],
  },
  {
    title: 'Spring Boot Banking App: Containerisation & Kubernetes',
    status: 'deployed', meta: 'Java · K8s',
    desc: "A monolithic Spring Boot app's oversized image and slow start-up blocked efficient Kubernetes deployment. Re-engineered it with multi-stage Docker builds, wrote Deployment/Service manifests and automated build & push in Jenkins.",
    win: '−60% image size · −30% start-up time',
    tags: ['Spring Boot', 'Multi-stage Docker', 'Kubernetes', 'Jenkins'],
    filters: ['k8s', 'cicd'],
    links: [],
  },
  {
    title: 'Agentic AI for DevOps — KubeHealer',
    status: 'active', meta: 'AIOps',
    desc: 'A progression of AI agents for real infra tasks: Docker error explainer → container troubleshooter → multi-tool agent with MCP → <b>KubeHealer</b>, a self-healing agent that detects broken pods, diagnoses root cause and fixes them.',
    tags: ['Python', 'Ollama', 'LangChain', 'MCP', 'Temporal', 'Kubernetes'],
    filters: ['ai', 'k8s'],
    links: [['source', gh('Agentic_AI_for_DevOps')]],
  },
  {
    title: 'Observability Stack for DevOps',
    status: 'deployed', meta: 'Monitoring',
    desc: 'Metrics, logs and traces in one <code>docker compose up</code>: Prometheus scraping Node Exporter, cAdvisor and an OTEL Collector; Loki + Promtail for container logs; Grafana auto-provisioned against both.',
    tags: ['Prometheus', 'Grafana', 'Loki', 'Promtail', 'OpenTelemetry', 'cAdvisor'],
    filters: ['obs'],
    links: [['source', gh('observability-for-devops')]],
  },
  {
    title: 'Kubernetes VNF: Cloud vs Edge',
    status: 'benchmarked', meta: 'Cloud vs Edge',
    desc: 'Deployed CoreDNS as a Virtual Network Function on a cloud cluster (kind) and an edge cluster (K3s), then load-tested at 100 / 500 / 1000 QPS to compare latency across environments.',
    win: 'edge beat cloud at 1000 QPS: 0.216 ms vs 0.342 ms',
    tags: ['Kubernetes', 'kind', 'K3s', 'CoreDNS', 'Load testing'],
    filters: ['k8s', 'cloud'],
    links: [['source', gh('Cloud_Computing_-Cloud_vs_Edge-Coursework_2')]],
  },
  {
    title: 'Online Shop — DevOps Hackathon',
    status: 'deployed', meta: 'Hackathon',
    desc: 'Took a React e-commerce app to the internet on AWS EC2: multi-stage Dockerfile, Compose with health checks and custom networking, Docker Scout vulnerability scanning, plus Kubernetes manifests with HPA and NGINX ingress.',
    win: '−1 GB image · +50% deployment speed',
    tags: ['Docker', 'Docker Scout', 'AWS EC2', 'CodeBuild', 'K8s HPA', 'Ingress'],
    filters: ['cloud', 'cicd', 'k8s'],
    links: [['source', gh('Online-shopping-app')]],
  },
  {
    title: 'SignalChain.AI — Self-Healing Supply Chain',
    status: 'shipped', meta: "Leeds Hackathon '26",
    desc: 'A predictive ops command centre: risk scoring for shipment delays, a one-click "trigger recovery" digital twin that simulates rerouting, CO₂e tracking and a natural-language assistant over the data.',
    tags: ['FastAPI', 'Pandas', 'Chart.js', 'JavaScript'],
    filters: ['ai'],
    links: [['source', gh('Leeds_Hackathon_2026')]],
  },
  {
    title: 'Prescription Refill Risk — Pharmacy2U Challenge',
    status: 'shipped', meta: 'Data & AI Hackathon',
    desc: 'University of Leeds Data & AI Hackathon (Track 1): modelled prescription refill risk and recommendations on CMS synthetic Part D prescription-event data.',
    tags: ['Python', 'Jupyter', 'Pandas', 'ML'],
    filters: ['ai'],
    links: [['source', gh('Hackathon_DATA_AI-Prescription_Refill_-_Recommendations')]],
  },
];

export const filters = [
  ['all', 'all'], ['cicd', 'ci/cd'], ['k8s', 'kubernetes'], ['cloud', 'aws/azure'], ['obs', 'observability'], ['ai', 'ai & data'],
];

export const moreRepos = [
  ['aws-devops-demo-deploy', 'aws-devops-demo-deploy-', 'Jenkins · Sonar'],
  ['jenkins-server', 'jenkins-server', 'React · Django'],
  ['Ekart', 'Ekart', 'Spring Boot · Docker'],
  ['hospital-management', 'hospital_management-using-AWS-and-DOCKER-', 'AWS · Docker'],
  ['wisdom-sprouts', 'Wisdom_sprouts-AWS-web-application', 'AWS'],
  ['blockchain-smart-contract', 'Blockchain_Smart_Contract', 'Solidity'],
  ['ga-microservice-comparison', 'Genetic_Algorithm_microservice_comparison', 'Python'],
  ['90-days-of-devops', '90_Days_OF_DevOps', 'learning log'],
  ['face-recognition', 'Face_recognition', 'OpenCV'],
].map(([name, repo, note]) => ({ name, url: gh(repo), note }));

// Dissertation: measured speed-ups only (no interpolated points)
export const scaling = [
  { workers: 1, speedup: 1.0 },
  { workers: 2, speedup: 1.79 },
  { workers: 12, speedup: 4.28 },
];

export const skills = {
  cloud: { note: 'aws + azure', items: ['AWS EC2', 'S3', 'RDS', 'IAM', 'VPC', 'Security Groups', 'ELB', 'Auto Scaling', 'EKS', 'Azure VMs'] },
  ci_cd: { note: 'pipelines & devsecops', items: ['Jenkins (Pipeline as Code)', 'GitHub Actions', 'SonarQube (SAST)', 'Docker Scout', 'Webhooks', 'Quality Gates'] },
  containers: { note: 'build & orchestrate', items: ['Docker', 'Docker Compose', 'Multi-stage builds', 'Kubernetes', 'Persistent Volumes', 'HPA', 'kind', 'K3s'] },
  iac: { note: 'infra as code', items: ['Terraform', 'Ansible', 'YAML'] },
  observability: { note: 'see what runs', items: ['Prometheus', 'Grafana', 'Loki', 'OpenTelemetry', 'cAdvisor'] },
  linux: { note: 'sysadmin & net', items: ['RHEL', 'CentOS', 'Ubuntu', 'SSH', 'firewalld', 'cron', 'Apache', 'MySQL'] },
  scripting: { note: 'glue', items: ['Bash', 'Python', 'Git', 'GitHub', 'GitLab'] },
  ai_ops: { note: 'agents for infra', items: ['LLM agents', 'LangChain', 'MCP', 'Ollama', 'Temporal'] },
  also: { note: 'app frameworks', items: ['FastAPI', 'Flask', 'Spring Boot', 'Node.js', 'React', 'Pandas'] },
};

// marquee rows: [label, colour var]
export const marquee = [
  [['AWS', '--amber'], ['Azure', '--cyan'], ['Kubernetes', '--cyan'], ['Docker', '--cyan'], ['Terraform', '--accent'], ['Ansible', '--red'], ['Jenkins', '--red'], ['GitHub Actions', '--accent'], ['SonarQube', '--cyan'], ['EKS', '--amber']],
  [['Prometheus', '--red'], ['Grafana', '--amber'], ['Loki', '--amber'], ['OpenTelemetry', '--cyan'], ['Linux / RHEL', '--red'], ['Bash', '--accent'], ['Python', '--amber'], ['GitLab', '--amber'], ['K3s', '--accent'], ['MCP agents', '--accent']],
];

export const education = [
  {
    ver: 'v2.0', when: 'Sep 2025 – Sep 2026',
    title: 'MSc Advanced Computer Science (Cloud Computing)',
    where: 'University of Leeds, UK',
    notes: ['Dissertation: distributed parallel GA on Azure', 'Cloud vs edge Kubernetes evaluation', 'Two university hackathons'],
  },
  {
    ver: 'v1.0', when: 'Dec 2021 – May 2025',
    title: 'B.Tech Computer Science & Engineering',
    where: 'D.Y. Patil Technical Campus, Kolhapur, India',
    notes: ['Graduated in the top 15% of the cohort'],
  },
  {
    ver: 'extras', when: 'during B.Tech',
    title: 'Leadership & activities',
    where: 'Outside the classroom',
    notes: ['<b>Lead</b>, Linux Club (Year 3)', '<b>Team Lead</b>, College Technical Fest'],
  },
];
