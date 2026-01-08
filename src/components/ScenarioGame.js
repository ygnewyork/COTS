"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowRight,
    RefreshCw,
    CheckCircle,
    AlertTriangle,
} from "lucide-react";
import GameSidebar from "./GameSidebar";
import {
    applyEffects,
    checkConditions,
    calculateDerived,
    evaluateFormula,
} from "@/utils/gameUtils";
// Importing directly from root might be tricky depending on config,
// but for now we assume we can or we'll fix it.
// A safer bet is to copy it to src/data or similar if this fails,
// but let's try to assume it's available or provided via page.
import gameData from "../../exmpale.json";

export default function ScenarioGame() {
    const [currentScenarioId, setCurrentScenarioId] = useState(
        gameData.scenarios[0].id
    );

    // Initialize state with defaults from JSON
    const [gameState, setGameState] = useState(() => ({
        ...gameData.initialState,
        // Ensure derived fields are calculated initially if needed,
        // though usually they depend on other state.
        // We can also compute them on the fly.
    }));

    const [feedback, setFeedback] = useState(null);
    const [history, setHistory] = useState([]); // Track path for debugging or summary
    const [gameStatus, setGameStatus] = useState("playing"); // playing, feedback, finished

    // Compute derived fields whenever state changes
    const derivedState = useMemo(() => {
        let derived = { ...gameState };
        if (!derived.derived) derived.derived = {}; // Ensure derived container exists

        if (gameData.derivedFields) {
            gameData.derivedFields.forEach((field) => {
                try {
                    const val = evaluateFormula(field.formula, derived);
                    // Store in both places to handle inconsistent JSON usage
                    // (Sidebar uses 'utilizationPct', conditions uses 'derived.utilizationPct')
                    derived[field.id] = val;
                    derived.derived[field.id] = val;
                } catch (e) {
                    console.error("Derived calc error", e);
                }
            });
        }
        return derived;
    }, [gameState]);

    // Merge derived into main state for sidebar/logic usage
    const fullState = { ...derivedState };

    const currentScenario = gameData.scenarios.find(
        (s) => s.id === currentScenarioId
    );

    const handleOption = (option) => {
        // 1. Calculate base effects
        let nextState = applyEffects(fullState, option.effects);
        let message = option.teach;
        let extraScore = 0;

        // 2. Handle Bonus Event (if lucky)
        if (option.bonusEvent) {
            const roll = Math.random();
            if (roll < option.bonusEvent.chance) {
                nextState = applyEffects(
                    nextState,
                    option.bonusEvent.onTriggerEffects
                );
                message += " " + option.bonusEvent.message;

                // Calculate bonus score diff specifically?
                // Or just let the total diff capture it.
                // But we prefer explicit feedback maybe?
                // Let's just rely on total score diff.
            }
        }

        // 3. Determine feedback (diff score/cash etc from START state to END state)
        // Note: derived fields update automatically on render, but for feedback we might want to know immediate score change.
        // 'score' is a direct field, so it is updated in nextState.
        const scoreDiff = nextState.score - fullState.score;

        setFeedback({
            message: message,
            scoreDiff,
            nextId: option.next,
        });

        setGameState(nextState);
        setGameStatus("feedback");

        // Add to history
        setHistory((prev) => [
            ...prev,
            { scenarioId: currentScenarioId, optionId: option.id },
        ]);
    };

    const handleNext = () => {
        if (feedback.nextId === "END") {
            setGameStatus("finished");
        } else {
            // Logic to resolve next scenario if it's conditional?
            // In the JSON, 'next' is a string ID.
            // But in Q10, we see 'outcome' and 'next': 'END'.
            // If the scenarios were branching dynamically based on conditions NOT inside options,
            // we'd handle it here.
            // BUT looking at Q10, the options THEMSELVES have conditions.
            // Wait, filter options based on conditions?
            // "options": [ ... { conditions: [...] } ... ]
            // We should check if an option is available?
            // OR does the USER pick an option, or does the SYSTEM pick for them?
            // In Q10, the "options" look like outcomes based on state ("You kept utilization low...").
            // They look like auto-resolved branches?
            // "prompt": "Apartment time: you apply to rent. What happens?"
            // Options text: "You kept utilization low..."
            // These act as result paths. The USER doesn't choose "I kept utilization low".
            // We need to auto-select the option that matches conditions for Q10-style scenarios.

            setCurrentScenarioId(feedback.nextId);
            setGameStatus("playing");
            setFeedback(null);
        }
    };

    const resetGame = () => {
        setGameState(gameData.initialState);
        setCurrentScenarioId(gameData.scenarios[0].id);
        setGameStatus("playing");
        setFeedback(null);
        setHistory([]);
    };

    // Check for auto-resolving scenarios (like Q10)
    useEffect(() => {
        if (gameStatus === "playing" && currentScenario) {
            // If all options have conditions, it might be an auto-resolve verification node?
            // Or maybe just filter valid options?
            // "text" says "You kept utilization low". This implies the user sees what happened,
            // rather than making a choice.
            // Let's look at Q10 structure again.
            // It has options. Each has conditions.
            // If it's an "event" scenario, maybe we display the result immediately?
            // For now, let's just filter options that don't meet conditions.
            // If only 1 remains, maybe auto-select?
            // Or show them as "Result: ..."
            // Let's implemented a check:
            // If an option has conditions, only show it if they are met.
            // If a fallback exists, use it?
            // The JSON has "fallback" on Q10.
        }
    }, [currentScenario, gameStatus, fullState]);

    // Helper to filter valid options
    const getValidOptions = () => {
        if (!currentScenario) return [];

        // Special handling for scenarios with conditional outcomes (like Q10)
        // where the user doesn't "choose" but rather "experiences" the result.
        const conditionalOptions = currentScenario.options.filter(
            (o) => o.conditions
        );

        if (conditionalOptions.length > 0) {
            // Find the first match
            const match = conditionalOptions.find((o) =>
                checkConditions(fullState, o.conditions)
            );
            if (match) return [match];

            // If no match, check fallback
            if (
                currentScenario.fallback &&
                currentScenario.fallback.ifNoConditionsMatch
            ) {
                // Construct a virtual option from fallback
                return [
                    {
                        id: "fallback",
                        label: "Result",
                        text: currentScenario.fallback.ifNoConditionsMatch
                            .outcome.message,
                        teach: currentScenario.fallback.ifNoConditionsMatch
                            .outcome.message,
                        effects:
                            currentScenario.fallback.ifNoConditionsMatch
                                .effects,
                        next: currentScenario.fallback.ifNoConditionsMatch.next,
                    },
                ];
            }
        }

        return currentScenario.options;
    };

    const validOptions = getValidOptions();

    // If we are in 'playing' mode and it's an auto-resolve scenario (only 1 valid option and it's a result),
    // we might want to present it differently or auto-advance.
    // But for the game feel, let user click "Continue" or "See Result".
    // Q10 options text is "You kept utilization low..." -> User clicks to confirm?
    // Let's render them as buttons still.

    if (!currentScenario && gameStatus !== "finished")
        return <div>Loading...</div>;

    return (
        <div className="flex flex-col md:flex-row h-[calc(100vh-80px)]">
            {/* Sidebar */}
            <GameSidebar state={fullState} config={gameData.ui.sidebar} />

            {/* Main Content */}
            <div className="flex-1 p-6 md:p-12 overflow-y-auto flex items-center justify-center bg-clarity-dark relative">
                <div className="max-w-3xl w-full">
                    {gameStatus === "finished" ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center bg-clarity-card p-12 rounded-3xl border border-clarity-border shadow-2xl"
                        >
                            <h2 className="text-4xl font-bold text-white mb-6">
                                Simulation Complete
                            </h2>
                            <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-clarity-red to-clarity-blue mb-8">
                                {Math.round(fullState.score)}
                            </div>
                            <p className="text-gray-400 mb-8">
                                Your final credit score.{" "}
                                {fullState.score >= 700
                                    ? "Excellent work!"
                                    : "Room for improvement."}
                            </p>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="p-4 bg-clarity-dark rounded-xl">
                                    <p className="text-sm text-gray-500">
                                        Cash
                                    </p>
                                    <p className="text-2xl font-bold text-white">
                                        ${fullState.cash}
                                    </p>
                                </div>
                                <div className="p-4 bg-clarity-dark rounded-xl">
                                    <p className="text-sm text-gray-500">
                                        Total Accounts
                                    </p>
                                    <p className="text-2xl font-bold text-white">
                                        {fullState.stats.accounts}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={resetGame}
                                className="px-8 py-4 bg-white text-clarity-dark rounded-full font-bold hover:bg-gray-200 transition-colors inline-flex items-center gap-2"
                            >
                                <RefreshCw className="w-5 h-5" /> Play Again
                            </button>
                        </motion.div>
                    ) : (
                        <AnimatePresence mode="wait">
                            {gameStatus === "playing" ? (
                                <motion.div
                                    key="question"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="w-full"
                                >
                                    <div className="mb-8">
                                        <span className="text-clarity-blue text-sm font-bold tracking-widest uppercase">
                                            Scenario{" "}
                                            {currentScenarioId
                                                .split("_")[0]
                                                .replace("Q", "")}
                                        </span>
                                        <h1 className="text-4xl md:text-5xl font-bold text-white mt-4 mb-6 leading-tight">
                                            {currentScenario.prompt}
                                        </h1>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4">
                                        {validOptions.map((opt, idx) => (
                                            <button
                                                key={opt.id || idx}
                                                onClick={() =>
                                                    handleOption(opt)
                                                }
                                                className="group p-6 text-left rounded-2xl bg-clarity-card border border-clarity-border hover:border-clarity-blue hover:bg-clarity-blue/5 transition-all duration-300"
                                            >
                                                <div className="flex items-start gap-4">
                                                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-clarity-dark text-gray-400 flex items-center justify-center font-bold group-hover:bg-clarity-blue group-hover:text-white transition-colors">
                                                        {opt.label ||
                                                            String.fromCharCode(
                                                                65 + idx
                                                            )}
                                                    </span>
                                                    <div>
                                                        <p className="text-xl font-medium text-white group-hover:text-clarity-blue transition-colors">
                                                            {opt.text}
                                                        </p>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="feedback"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-clarity-card p-8 md:p-12 rounded-3xl border border-clarity-border shadow-2xl text-center max-w-2xl mx-auto"
                                >
                                    <div className="mb-6 inline-flex p-4 rounded-full bg-clarity-dark">
                                        {feedback.scoreDiff >= 0 ? (
                                            <CheckCircle className="w-12 h-12 text-green-500" />
                                        ) : (
                                            <AlertTriangle className="w-12 h-12 text-red-500" />
                                        )}
                                    </div>

                                    <h2 className="text-3xl font-bold text-white mb-4">
                                        {feedback.scoreDiff > 0
                                            ? "Good Move!"
                                            : feedback.scoreDiff < 0
                                            ? "Credit Hit!"
                                            : "Note"}
                                    </h2>

                                    {feedback.scoreDiff !== 0 && (
                                        <div
                                            className={`text-5xl font-bold mb-8 ${
                                                feedback.scoreDiff > 0
                                                    ? "text-green-400"
                                                    : "text-red-400"
                                            }`}
                                        >
                                            {feedback.scoreDiff > 0 ? "+" : ""}
                                            {feedback.scoreDiff}
                                        </div>
                                    )}

                                    <p className="text-xl text-gray-300 leading-relaxed mb-10">
                                        {feedback.message}
                                    </p>

                                    <button
                                        onClick={handleNext}
                                        className="w-full py-4 bg-clarity-blue text-white rounded-xl font-bold text-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                                    >
                                        Continue{" "}
                                        <ArrowRight className="w-5 h-5" />
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    )}
                </div>
            </div>
        </div>
    );
}
