### Use Cases

*(Sơ đồ Use Case tổng quát: xem tại file `docs/diagrams/use_case_diagram_master.png`)*

| ID | Use Case | Actors | Use Case Description |
| :---: | :--- | :--- | :--- |
| **UC-01** | Register & Log in | All Actors | Authenticates users via email or phone credentials and issues a secure JSON Web Token (JWT) session. |
| **UC-02** | Recover Password | All Actors | Enables users to reset credentials via predefined security verification mechanisms within the local environment. |
| **UC-03** | Submit Lineage Verification Claim | Prospective Member | Allows unregistered relatives to submit verification dossiers (parentage, ancestral branch, birth certificates) to seek clan admission. |
| **UC-04** | View & Update Personal Profile | Family Member | Displays and updates demographic details, current residential address, biographical summaries, and avatar images. |
| **UC-05** | Configure Profile Privacy Settings | Family Member | Allows members to toggle the visibility of sensitive contact information (phone number, private address) across different clan branches. |
| **UC-06** | Explore Interactive Family Tree | Family Member | Renders an interactive multi-generational graph canvas supporting zooming, panning, node expansion, and generational filtering. |
| **UC-07** | Claim Family Relationships | Family Member | Enables members to propose parent-child or spousal relationships linking their node to existing or new family members. |
| **UC-08** | Approve Lineage Node Links | Clan / Branch Leader | Authorizes leaders to review, validate, and commit proposed kinship connections to the official master genealogy tree. |
| **UC-09** | Edit Family Tree Node Information | Clan / Branch Leader | Modifies historical records (birth dates, death dates, burial locations, lifetime biographies) directly on graph nodes. |
| **UC-10** | Manage Clan Branches | Clan Leader | Creates new genealogical branches (*chi phái*), defines branch hierarchies, and manages genealogical branch divisions. |
| **UC-11** | Validate Graph Cycle Constraints | System, Clan Leader | Automated constraint verification engine that blocks circular ancestral dependencies (e.g., preventing descendants from becoming their own ancestors). |
| **UC-12** | Export Family Tree Diagram | Clan Leader, Member | Renders and exports the full genealogy tree or selected branch views into high-resolution PDF or SVG formats for ceremonial printing. |
| **UC-13** | Create Community Post & Share Media | Family Member | Publishes family news, commemorative updates, and multimedia stories to the clan-wide or branch-specific feed. |
| **UC-14** | Interact & Comment | Family Member | Allows members to leave comments and express cultural reaction icons (*Like, Proud, Remembrance*) on community stories. |
| **UC-15** | Moderate Community Content | Clan / Branch Leader | Empowers leaders to review, hide, or delete inappropriate posts or comments that violate clan guidelines. |
| **UC-16** | Issue Official Clan Announcements | Clan Leader | Publishes verified ancestral notifications (e.g., ancestral hall renovation appeals, major bereavement notices) flagged with official emblems. |
| **UC-17** | Manage Memorial Photo Albums | Family Member | Creates tagged image and video collections categorized by anniversary years, tomb-sweeping events, or reunion dates. |
| **UC-18** | Pin Important Announcements | Clan / Branch Leader | Pins vital community notices or ancestral invocations to the top of the clan feed for guaranteed visibility. |
| **UC-19** | Schedule Memorial Event (Lunar Calendar) | Clan / Branch Leader | Sets up death anniversaries (*Giỗ chạp*) and gatherings using lunar dates; the system automatically calculates corresponding solar dates and dispatches reminders. |
| **UC-20** | Confirm Event Attendance (RSVP) | Family Member | Enables members to confirm attendance (*Attending, Absent, Attending with Family + Headcount*) to facilitate catering logistics. |
| **UC-21** | Assign Gathering & Memorial Tasks | Branch Leader | Creates task checklists (ceremonial prayer, culinary preparation, reception) and assigns operational duties to specific relatives. |
| **UC-22** | View Family Calendar & Memorial Schedule | Family Member | Displays an integrated monthly calendar highlighting ancestral death anniversaries, clan meetings, and cultural milestones. |
| **UC-23** | Track Event Attendance & Capacity | Clan / Branch Leader | Aggregates real-time RSVP responses by branch to forecast logistics, seating arrangements, and budget allocations. |
| **UC-24** | Search Clan Member Directory | Family Member | Provides search and filtering capabilities across the living clan registry by name, generation number, branch, or current city. |
| **UC-25** | Update Career & Educational Profiles | Family Member | Allows members to record their professions, alumni affiliations, and expertise to foster professional networking within the lineage. |
| **UC-26** | Discover Mutual Aid & Mentorship Connections | Family Member | Filters relatives by professional fields (e.g., Medicine, Law, Engineering, Academia) for vocational counseling and mutual assistance. |
| **UC-27** | Manage Branch Contact Directory | Branch Leader | Accesses contact details of household heads within a specific branch for emergency notifications and administrative mobilization. |
| **UC-28** | Manage Digital Phả Ký (Genealogy Archives) | Clan Leader | Digitizes, uploads, and organizes historical Sino-Nom manuscripts, quốc ngữ translations, and historical lineage origins. |
| **UC-29** | Document Ancestor Biographies | Clan Leader, Member | Authors comprehensive biographical profiles detailing the merits, official titles, and contributions of prominent ancestors. |
| **UC-30** | Archive Ceremonial Prayers & Ritual Texts | Clan Leader | Maintains a standardized digital repository of traditional ritual invocations (*văn khấn*) and ceremonial protocols for younger generations. |
| **UC-31** | Browse Family Heritage Library | Family Member | Grants members read-only access to browse digitized archival chronicles, historical deeds, and ancestral photo collections. |
| **UC-32** | Chat with AI Kinship Assistant | Family Member | Conversational chatbot interface backed by a local LLM, allowing members to ask questions regarding lineage, history, and customs. |
| **UC-33** | Query Vietnamese Kinship Pronouns | Family Member, AI | Calculates graph topological distance between two nodes and outputs culturally accurate Vietnamese kinship address terms (*Bác, Chú, Cô, Cậu, Thím, Cháu...*). |
| **UC-34** | Semantic Phả Ký Search (RAG) | Family Member, AI | Processes natural language questions (e.g., *"When did our 3rd generation ancestor relocate to the village?"*) and retrieves exact historical excerpts using vector similarity. |
| **UC-35** | Summarize Ancestral Biographies via AI | Family Member, AI | Synthesizes lengthy historical phả ký texts into concise bullet points highlighting key historical deeds and life milestones. |
| **UC-36** | Recommend Member Connections & Mentors | Family Member, AI | Analyzes professional and academic backgrounds to recommend mentorship or networking pairings among younger relatives. |
| **UC-37** | View Clan Demographics Dashboard | Clan Leader, Admin | Visualizes clan-wide demographic analytics including age distributions, gender balance, living-to-deceased ratios, and geographical spread. |
| **UC-38** | Track Member Growth & Demographic Trends | Clan Leader | Generates longitudinal reports tracking annual births, marriages, deceased members, and net lineage expansion. |
| **UC-39** | Monitor Community Engagement Metrics | Branch Leader | Tracks post engagement rates, discussion activity, and digital platform adoption across individual lineage branches. |
| **UC-40** | Export Statistical Reports (Excel/PDF) | Clan Leader, Admin | Generates structured tabular reports of clan demographic data and membership rolls for annual year-end clan assemblies. |
| **UC-41** | Manage User Accounts & Lifecycle | System Administrator | Provisions administrative accounts, toggles active/locked states, and handles security suspensions for non-compliant users. |
| **UC-42** | Configure Role-Based Access Control (RBAC) | System Administrator | Defines granular permissions for system roles (Clan Leader, Branch Leader, Member, Guest) and binds authorization scopes. |
| **UC-43** | Monitor System Audit Logs | System Administrator | Inspects append-only logs recording data modifications, node alterations, user authentications, timestamps, and local IP addresses. |
| **UC-44** | Backup & Restore Local Database | System Administrator | Manages one-click execution of local PostgreSQL database dumps and media archive bundling, supporting restoration during recovery drills. |
| **UC-45** | Configure Local System Parameters | System Administrator | Manages local Ollama connection strings, LLM model tags, context window sizes, temperature thresholds, and media storage capacity limits. |
