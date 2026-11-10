## User Requirements
### System Actors

| # | Actor | Description |
| :-: | :--- | :--- |
| **1** | **System Administrator** | Responsible for technical system configuration, managing user accounts, enforcing Role-Based Access Control (RBAC) policies, inspecting security and audit logs, executing on-premise database backup/restore procedures, and monitoring local Docker runtime performance. |
| **2** | **Clan Leader / Council**<br>*(Trưởng họ / Ban liên lạc)* | Holds sovereign authority over clan genealogy. Responsible for reviewing and approving lineage connection claims, ratifying new member nodes into the master tree, managing branch subdivisions, publishing official clan communiqués, appointing Branch Leaders, and endorsing distinguished family members. |
| **3** | **Branch Leader**<br>*(Trưởng chi tộc)* | Responsible for administrative and communal governance within a specific genealogical branch (*chi phái*). Tasks include scheduling ancestral memorial anniversaries (*Giỗ chạp*) synchronized with the lunar calendar, moderating branch posts and media, tracking event RSVP attendance, and delegating ceremonial duties. |
| **4** | **Verified Family Member** | Legitimate relatives whose identities are formally mapped to nodes on the genealogy graph. Granted permissions to explore the interactive family tree, manage personal and marital profiles, post community stories and photos, submit event RSVPs, and query the Local AI Assistant for lineage and kinship pronoun guidance. |
| **5** | **Prospective Member / Guest** | Newly registered users whose lineage has not yet been validated. Permitted to browse publicly accessible ancestral introductions and submit lineage verification claims (including parentage details and ancestral branch evidence) to the Clan Council. |
| **6** | **Local AI Agent**<br>*(System Actor)* | An autonomous background reasoning service powered by the local Ollama runtime. Ingests natural language queries, traverses genealogy graph structures to deduce precise Vietnamese kinship terminology according to generational seniority, and retrieves ancestral records using Retrieval-Augmented Generation (RAG). |
