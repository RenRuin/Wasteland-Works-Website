let currentProjectId = null;

async function loadProject() {
    const params = new URLSearchParams(window.location.search);
    currentProjectId = params.get("id");

    alert("Project ID is: " + currentProjectId);

    if (!currentProjectId) {
        document.getElementById("projectTitle").textContent =
            "No Project Selected";
        return;
    }

    const { data, error } = await supabaseClient
        .from("projects")
        .select("*")
        .eq("id", currentProjectId)
        .single();

    if (error) {
        document.getElementById("projectTitle").textContent =
            "Project Not Found";
        console.error(error);
        return;
    }

    document.getElementById("projectTitle").textContent = data.title;
    document.getElementById("projectDescription").textContent = data.description || "";
    document.getElementById("projectContent").textContent = data.content || "";

    document.getElementById("editTitle").value = data.title || "";
    document.getElementById("editDescription").value = data.description || "";
    document.getElementById("editContent").value = data.content || "";
}

async function updateProject() {
    const title = document.getElementById("editTitle").value;
    const description = document.getElementById("editDescription").value;
    const content = document.getElementById("editContent").value;

    const { error } = await supabaseClient
        .from("projects")
        .update({
            title: title,
            description: description,
            content: content
        })
        .eq("id", currentProjectId);

    if (error) {
        alert("Error updating project: " + error.message);
    } else {
        alert("Project updated!");
        loadProject();
    }
}

async function deleteProject() {
    const confirmDelete = confirm(
        "Are you sure you want to delete this project? This cannot be undone."
    );

    if (!confirmDelete) {
        return;
    }

    const { data, error } = await supabaseClient
        .from("projects")
        .delete()
        .eq("id", currentProjectId)
        .select();

    if (error) {
        alert("Error deleting project: " + error.message);
        return;
    }

    if (!data || data.length === 0) {
        alert("Nothing was deleted. The project may not have matched the ID.");
        return;
    }

    alert("Project deleted.");
    window.location.href = "projects.html";
}
loadProject();