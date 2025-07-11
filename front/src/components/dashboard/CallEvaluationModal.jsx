"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEvaluations } from "@/hooks/use-evaluations";
import { toast } from "sonner";

export const CallEvaluationModal = ({ isOpen, onClose, call }) => {
  // Custom hook for API calls
  const { createEvaluation, updateEvaluation, isLoading, error } =
    useEvaluations();

  // Form state for new evaluation
  const [evaluationType, setEvaluationType] = useState("human");
  const [score, setScore] = useState(5);
  const [notes, setNotes] = useState("");
  const [evaluatorName, setEvaluatorName] = useState("");
  const [evaluatorEmail, setEvaluatorEmail] = useState("");
  const [llmModel, setLlmModel] = useState("");
  const [llmConfidence, setLlmConfidence] = useState(0.5);
  const [communicationScore, setCommunicationScore] = useState(5);
  const [professionalismScore, setProfessionalismScore] = useState(5);
  const [problemSolvingScore, setProblemSolvingScore] = useState(5);

  // State for existing evaluation data
  const [existingEvaluation, setExistingEvaluation] = useState(null);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen && call) {
      // Reset form for new evaluations
      if (call.status === "pending") {
        setEvaluationType("human");
        setScore(5);
        setNotes("");
        setEvaluatorName("");
        setEvaluatorEmail("");
        setLlmModel("");
        setLlmConfidence(0.5);
        setCommunicationScore(5);
        setProfessionalismScore(5);
        setProblemSolvingScore(5);
        setExistingEvaluation(null);
      } else if (call.status === "evaluated") {
        // Fetch existing evaluation data
        fetchEvaluationData();
      }
    }
  }, [isOpen, call]);

  const fetchEvaluationData = async () => {
    try {
      // Call the call-evaluations endpoint to get evaluation details
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL ||
          "https://solum-test-back.up.railway.app"
        }/api/call-evaluations/${call.id}`
      );

      if (response.ok) {
        const evaluationData = await response.json();
        setExistingEvaluation(evaluationData);
      } else {
        toast.error("Error al cargar los datos de evaluación");
      }
    } catch (err) {
      console.error("Error fetching evaluation data:", err);
      toast.error("Error al cargar los datos de evaluación");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const evaluationData = {
        call_id: call?.id,
        external_call_id: call?.external_call_id,
        type: evaluationType,
        score,
        notes,
        communication_score: communicationScore,
        professionalism_score: professionalismScore,
        problem_solving_score: problemSolvingScore,
        ...(evaluationType === "human" && {
          evaluator_name: evaluatorName,
          evaluator_email: evaluatorEmail,
        }),
        ...(evaluationType === "llm" && {
          llm_model: llmModel,
          llm_confidence: llmConfidence,
        }),
      };

      await createEvaluation(evaluationData);
      toast.success("Evaluación creada exitosamente");
      console.log("Evaluation submitted:", evaluationData);

      // Close modal immediately
      onClose();
    } catch (error) {
      console.error("Error submitting evaluation:", error);
      toast.error("Error al crear la evaluación. Por favor, intenta de nuevo.");
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (seconds) => {
    if (seconds < 60) {
      return `${seconds}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const ScoreSlider = ({
    label,
    value,
    onChange,
    min = 0,
    max = 10,
    step = 0.1,
  }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium">{label}</label>
      <div className="space-y-2">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{min}</span>
          <span className="font-medium text-foreground">{value}</span>
          <span>{max}</span>
        </div>
      </div>
    </div>
  );

  if (!call) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Call Details & Evaluation - ID: {call.external_call_id}
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-6">
          {/* Call Information Section (Read-only, Compact) */}
          <Card className="p-4 mb-6 bg-gray-50">
            <h3 className="text-lg font-medium mb-3">Call Information</h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <span className="text-xs font-medium text-muted-foreground block">
                  External ID
                </span>
                <p className="font-mono text-sm">{call.external_call_id}</p>
              </div>
              <div>
                <span className="text-xs font-medium text-muted-foreground block">
                  Agent ID
                </span>
                <p className="text-sm">{call.agent_id}</p>
              </div>
              <div>
                <span className="text-xs font-medium text-muted-foreground block">
                  Call Type
                </span>
                <p className="text-sm">{call.call_type || "N/A"}</p>
              </div>
              <div>
                <span className="text-xs font-medium text-muted-foreground block">
                  Duration
                </span>
                <p className="text-sm">
                  {formatDuration(call.duration_seconds)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <span className="text-xs font-medium text-muted-foreground block">
                  Call Reason
                </span>
                <p className="text-sm">{call.call_reason || "N/A"}</p>
              </div>
              <div>
                <span className="text-xs font-medium text-muted-foreground block">
                  Customer Phone
                </span>
                <p className="text-sm">{call.customer_phone || "N/A"}</p>
              </div>
              <div>
                <span className="text-xs font-medium text-muted-foreground block">
                  Customer Name
                </span>
                <p className="text-sm">{call.customer_name || "N/A"}</p>
              </div>
              <div>
                <span className="text-xs font-medium text-muted-foreground block">
                  Timestamp
                </span>
                <p className="text-sm">
                  {formatTimestamp(call.call_timestamp)}
                </p>
              </div>
            </div>

            {/* Audio Player */}
            {call.audio_url && (
              <div className="mb-4">
                <span className="text-xs font-medium text-muted-foreground block mb-2">
                  Call Recording
                </span>
                <audio controls className="w-full">
                  <source src={call.audio_url} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}

            {/* Call Summary */}
            {call.summary && (
              <div>
                <span className="text-xs font-medium text-muted-foreground block mb-1">
                  Summary
                </span>
                <p className="text-sm text-gray-700 bg-white p-3 rounded border">
                  {call.summary}
                </p>
              </div>
            )}
          </Card>

          {/* Evaluation Section */}
          {call.status === "evaluated" && existingEvaluation ? (
            /* Show existing evaluation */
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                Existing Evaluation
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Evaluation Type
                      </label>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          existingEvaluation.evaluation_type === "human"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {existingEvaluation.evaluation_type === "human"
                          ? "Human"
                          : "LLM"}
                      </span>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Overall Score
                      </label>
                      <div className="flex items-center space-x-3">
                        <div
                          className={`px-4 py-2 rounded-lg font-bold text-lg ${
                            existingEvaluation.score >= 8
                              ? "bg-green-100 text-green-800"
                              : existingEvaluation.score >= 6
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {existingEvaluation.score}/10
                        </div>
                      </div>
                    </div>

                    {existingEvaluation.notes && (
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Notes
                        </label>
                        <div className="bg-gray-50 border rounded-lg p-3 text-sm">
                          {existingEvaluation.notes}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Detailed Scores
                      </label>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Communication</span>
                          <span className="font-medium">
                            {existingEvaluation.communication_score !== null
                              ? `${existingEvaluation.communication_score}/10`
                              : "Not set"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Professionalism</span>
                          <span className="font-medium">
                            {existingEvaluation.professionalism_score !== null
                              ? `${existingEvaluation.professionalism_score}/10`
                              : "Not set"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Problem Solving</span>
                          <span className="font-medium">
                            {existingEvaluation.problem_solving_score !== null
                              ? `${existingEvaluation.problem_solving_score}/10`
                              : "Not set"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {existingEvaluation.evaluation_created_at && (
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Created
                        </label>
                        <p className="text-sm text-muted-foreground">
                          {formatTimestamp(
                            existingEvaluation.evaluation_created_at
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            /* Show evaluation form for pending calls */
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">New Evaluation</h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column - Evaluation Type & Scores */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Evaluation Type
                      </label>
                      <Select
                        value={evaluationType}
                        onValueChange={setEvaluationType}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select evaluation type" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="human">
                            Human Evaluation
                          </SelectItem>
                          <SelectItem value="llm">LLM Evaluation</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <ScoreSlider
                      label="Overall Score (1-10)"
                      value={score}
                      onChange={setScore}
                      min={1}
                      max={10}
                      step={0.1}
                    />

                    <ScoreSlider
                      label="Communication Score (1-10)"
                      value={communicationScore}
                      onChange={setCommunicationScore}
                      min={1}
                      max={10}
                      step={0.1}
                    />

                    <ScoreSlider
                      label="Professionalism Score (1-10)"
                      value={professionalismScore}
                      onChange={setProfessionalismScore}
                      min={1}
                      max={10}
                      step={0.1}
                    />

                    <ScoreSlider
                      label="Problem Solving Score (1-10)"
                      value={problemSolvingScore}
                      onChange={setProblemSolvingScore}
                      min={1}
                      max={10}
                      step={0.1}
                    />
                  </div>

                  {/* Right Column - Details */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Notes
                      </label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Provide detailed evaluation notes..."
                        rows={6}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Human Evaluation Fields */}
                    {evaluationType === "human" && (
                      <>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Evaluator Name
                          </label>
                          <Input
                            value={evaluatorName}
                            onChange={(e) => setEvaluatorName(e.target.value)}
                            placeholder="Enter evaluator name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Evaluator Email
                          </label>
                          <Input
                            type="email"
                            value={evaluatorEmail}
                            onChange={(e) => setEvaluatorEmail(e.target.value)}
                            placeholder="Enter evaluator email"
                          />
                        </div>
                      </>
                    )}

                    {/* LLM Evaluation Fields */}
                    {evaluationType === "llm" && (
                      <>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            LLM Model
                          </label>
                          <Input
                            value={llmModel}
                            onChange={(e) => setLlmModel(e.target.value)}
                            placeholder="e.g., gpt-4, claude-3-sonnet"
                          />
                        </div>
                        <div>
                          <ScoreSlider
                            label="LLM Confidence (0-1)"
                            value={llmConfidence}
                            onChange={setLlmConfidence}
                            min={0}
                            max={1}
                            step={0.01}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-4">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isLoading ? "Submitting..." : "Submit Evaluation"}
                  </Button>
                </div>
              </form>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
