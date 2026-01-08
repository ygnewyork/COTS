import ScenarioGame from "@/components/ScenarioGame";
import Navbar from "@/components/Navbar";

export default function ScenarioPage() {
    return (
        <main className="min-h-screen bg-clarity-dark animated-bg">
            <Navbar />
            <div className="pt-20 h-screen overflow-hidden">
                <ScenarioGame />
            </div>
        </main>
    );
}
