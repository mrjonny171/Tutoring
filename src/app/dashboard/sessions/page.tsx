import { DashboardWrapper } from "@/components/layout/dashboard-wrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScheduleSessionModal } from "@/components/sessions/schedule-session-modal";

// Mock data for testing
const mockSessions = [
  {
    id: "1",
    title: "Mathematics Tutoring",
    description: "Algebra and Calculus session",
    startTime: new Date("2024-03-20T10:00:00"),
    endTime: new Date("2024-03-20T11:30:00"),
    status: "SCHEDULED",
    student: { name: "John Doe" },
    tutor: { name: "Jane Smith" },
  },
  {
    id: "2",
    title: "Physics Review",
    description: "Mechanics and Dynamics",
    startTime: new Date("2024-03-18T14:00:00"),
    endTime: new Date("2024-03-18T15:30:00"),
    status: "COMPLETED",
    student: { name: "John Doe" },
    tutor: { name: "Bob Wilson" },
  },
  {
    id: "3",
    title: "Chemistry Lab Prep",
    description: "Organic Chemistry",
    startTime: new Date("2024-03-22T09:00:00"),
    endTime: new Date("2024-03-22T10:30:00"),
    status: "SCHEDULED",
    student: { name: "John Doe" },
    tutor: { name: "Alice Brown" },
  },
];

export default function SessionsPage() {
  // Mock user role for testing - you can toggle between true/false
  const isTutor = false;

  const upcomingSessions = mockSessions.filter(
    (session) => session.status === "SCHEDULED"
  );
  const pastSessions = mockSessions.filter(
    (session) => session.status === "COMPLETED"
  );

  const handleSchedule = async (sessionData: {
    title: string;
    description: string;
    startTime: string;
    endTime: string;
  }) => {
    "use server";
    console.log("New session scheduled:", sessionData);
  };

  return (
    <DashboardWrapper>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Sessions</h1>
            <p className="text-muted-foreground">
              {isTutor
                ? "Manage your tutoring sessions"
                : "View your scheduled sessions"}
            </p>
          </div>
          <ScheduleSessionModal isTutor={isTutor} onSchedule={handleSchedule} />
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-4">Upcoming Sessions</h2>
            <div className="grid gap-4">
              {upcomingSessions.map((session) => (
                <Card key={session.id}>
                  <CardHeader>
                    <CardTitle>{session.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p>
                        <span className="font-medium">With:</span>{" "}
                        {isTutor ? session.student.name : session.tutor.name}
                      </p>
                      <p>
                        <span className="font-medium">When:</span>{" "}
                        {session.startTime.toLocaleString()}
                      </p>
                      <p>
                        <span className="font-medium">Duration:</span>{" "}
                        {Math.round(
                          (session.endTime.getTime() -
                            session.startTime.getTime()) /
                            (1000 * 60)
                        )}{" "}
                        minutes
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Past Sessions</h2>
            <div className="grid gap-4">
              {pastSessions.map((session) => (
                <Card key={session.id}>
                  <CardHeader>
                    <CardTitle>{session.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p>
                        <span className="font-medium">With:</span>{" "}
                        {isTutor ? session.student.name : session.tutor.name}
                      </p>
                      <p>
                        <span className="font-medium">When:</span>{" "}
                        {session.startTime.toLocaleString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </div>
    </DashboardWrapper>
  );
} 