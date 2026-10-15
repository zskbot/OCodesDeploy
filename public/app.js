const apiStatus = document.querySelector("#api-status");
const apiDetail = document.querySelector("#api-detail");
const projectCount = document.querySelector("#project-count");
const projectList = document.querySelector("#project-list");
const checkButton = document.querySelector("#check-api");

async function checkApi() {
  apiStatus.textContent = "Đang kiểm tra…";
  apiDetail.textContent = "Đang gọi /api/health";
  try {
    const response = await fetch("/api/health", { headers: { accept: "application/json" } });
    if (!response.ok) throw new Error("HTTP " + response.status);
    const data = await response.json();
    apiStatus.textContent = data.ok ? "Sẵn sàng" : "Có lỗi";
    apiDetail.textContent = data.service + " · v" + data.version;
    try {
      const projectsResponse = await fetch("/api/projects", { headers: { accept: "application/json" } });
      const projectsData = await projectsResponse.json();
      if (projectsResponse.ok && projectsData.ok) {
        projectCount.textContent = String(projectsData.projects.length);
        if (projectsData.projects.length) {
          projectList.className = "project-rows";
          projectList.replaceChildren();
          for (const project of projectsData.projects) {
            const row = document.createElement("div");
            row.className = "project-row";
            row.textContent = [project.name, project.repository_url || "Chưa kết nối", project.status].join(" · ");
            projectList.appendChild(row);
          }
        }
      } else {
        projectCount.textContent = "—";
        apiDetail.textContent = "Health check OK; D1 chưa sẵn sàng.";
      }
    } catch {
      projectCount.textContent = "—";
    }
  } catch {
    apiStatus.textContent = "Chưa kết nối";
    apiDetail.textContent = "Dashboard cần được phục vụ cùng Worker API.";
  }
}
checkButton.addEventListener("click", checkApi);
