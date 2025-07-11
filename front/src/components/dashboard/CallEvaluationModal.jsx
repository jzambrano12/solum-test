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
  const [isEditingScores, setIsEditingScores] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen && !call?.evaluation_id) {
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
    }
    // Reset editing state when modal opens/closes
    if (isOpen) {
      setIsEditingScores(false);
    }
  }, [isOpen, call?.evaluation_id]);

  // Use real evaluation data if available
  const existingEvaluation = call?.evaluation_id ? call : null;

  // Check if detailed scores are missing in existing evaluation
  const hasMissingDetailedScores =
    existingEvaluation &&
    (existingEvaluation.communication_score === null ||
      existingEvaluation.communication_score === undefined ||
      existingEvaluation.professionalism_score === null ||
      existingEvaluation.professionalism_score === undefined ||
      existingEvaluation.problem_solving_score === null ||
      existingEvaluation.problem_solving_score === undefined);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");

    try {
      const evaluationData = {
        call_id: call?.call_id,
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
      setSuccessMessage("Evaluación creada exitosamente");
      console.log("Evaluation submitted:", evaluationData);

      // Close modal after short delay to show success message
      setTimeout(() => {
        onClose();
        setSuccessMessage("");
      }, 1500);
    } catch (error) {
      console.error("Error submitting evaluation:", error);
      // Error is handled by the hook
    }
  };

  const handleUpdateScores = async (e) => {
    e.preventDefault();
    setSuccessMessage("");

    try {
      const updateData = {
        communication_score: communicationScore,
        professionalism_score: professionalismScore,
        problem_solving_score: problemSolvingScore,
      };

      await updateEvaluation(existingEvaluation.evaluation_id, updateData);
      setSuccessMessage("Scores actualizados exitosamente");
      console.log("Detailed scores updated:", updateData);

      setIsEditingScores(false);

      // Close modal after short delay to show success message
      setTimeout(() => {
        onClose();
        setSuccessMessage("");
      }, 1500);
    } catch (error) {
      console.error("Error updating evaluation:", error);
      // Error is handled by the hook
    }
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
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {existingEvaluation
              ? "Call Evaluation Details"
              : "New Call Evaluation"}{" "}
            - ID: {call.external_call_id}
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-6">
          {/* Success and Error Messages */}
          {successMessage && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              {successMessage}
            </div>
          )}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {/* Call Information */}
          <div className="mb-6">
            <Card className="p-4 bg-gray-50">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium text-muted-foreground">
                    Company:
                  </span>
                  <p className="font-medium">{call.company_name}</p>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">
                    Agent:
                  </span>
                  <p className="font-medium">{call.agent_name}</p>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">
                    Type:
                  </span>
                  <p className="font-medium">
                    {call.agent_type} - {call.agent_environment}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">
                    Duration:
                  </span>
                  <p className="font-medium">
                    {Math.floor(call.duration_seconds / 60)}:
                    {(call.duration_seconds % 60).toString().padStart(2, "0")}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Audio Player Section */}
          <div className="mb-6">
            <Card className="p-4 bg-gray-50">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Call Recording</h3>
                  <span className="text-sm text-muted-foreground">
                    Duration: {Math.floor(call.duration_seconds / 60)}:
                    {(call.duration_seconds % 60).toString().padStart(2, "0")}
                  </span>
                </div>

                {call.audio_url ? (
                  <div className="bg-white rounded-lg p-4 border">
                    <audio controls className="w-full">
                      <source src={call.audio_url} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                ) : (
                  <div className="bg-white rounded-lg p-4 border text-center text-muted-foreground">
                    No audio recording available
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Call Summary */}
          {call.summary && (
            <div className="mb-6">
              <Card className="p-4">
                <h3 className="text-lg font-medium mb-3">Call Summary</h3>
                <p className="text-muted-foreground">{call.summary}</p>
              </Card>
            </div>
          )}

          {existingEvaluation ? (
            /* Show existing evaluation details */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Evaluation Details */}
              <div>
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Evaluation Details
                  </h3>

                  <div className="space-y-4">
                    {/* Evaluation Type */}
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

                    {/* Overall Score */}
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
                        <div className="flex-1 bg-gray-200 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full transition-all duration-300 ${
                              existingEvaluation.score >= 8
                                ? "bg-green-500"
                                : existingEvaluation.score >= 6
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                            style={{
                              width: `${(existingEvaluation.score || 0) * 10}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Detailed Scores */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="block text-sm font-medium">
                          Detailed Scores
                        </label>
                        {hasMissingDetailedScores && !isEditingScores && (
                          <Button
                            onClick={() => {
                              setIsEditingScores(true);
                              // Set current values or defaults for editing
                              setCommunicationScore(
                                existingEvaluation.communication_score || 5
                              );
                              setProfessionalismScore(
                                existingEvaluation.professionalism_score || 5
                              );
                              setProblemSolvingScore(
                                existingEvaluation.problem_solving_score || 5
                              );
                            }}
                            variant="outline"
                            size="sm"
                          >
                            Add Missing Scores
                          </Button>
                        )}
                      </div>

                      {isEditingScores ? (
                        /* Edit form for detailed scores */
                        <form
                          onSubmit={handleUpdateScores}
                          className="space-y-4"
                        >
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
                          <div className="flex gap-2">
                            <Button
                              type="submit"
                              disabled={isLoading}
                              size="sm"
                            >
                              {isLoading ? "Saving..." : "Save Scores"}
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setIsEditingScores(false)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </form>
                      ) : (
                        /* Display existing scores */
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Communication</span>
                            <span className="font-medium">
                              {existingEvaluation.communication_score !==
                                null &&
                              existingEvaluation.communication_score !==
                                undefined
                                ? `${existingEvaluation.communication_score}/10`
                                : "Not set"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Professionalism</span>
                            <span className="font-medium">
                              {existingEvaluation.professionalism_score !==
                                null &&
                              existingEvaluation.professionalism_score !==
                                undefined
                                ? `${existingEvaluation.professionalism_score}/10`
                                : "Not set"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Problem Solving</span>
                            <span className="font-medium">
                              {existingEvaluation.problem_solving_score !==
                                null &&
                              existingEvaluation.problem_solving_score !==
                                undefined
                                ? `${existingEvaluation.problem_solving_score}/10`
                                : "Not set"}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Notes */}
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

                    {/* Evaluator Info (Human) */}
                    {existingEvaluation.evaluation_type === "human" &&
                      (existingEvaluation.evaluator_name ||
                        existingEvaluation.evaluator_email) && (
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Evaluator
                          </label>
                          <div className="text-sm text-muted-foreground">
                            {existingEvaluation.evaluator_name && (
                              <div>{existingEvaluation.evaluator_name}</div>
                            )}
                            {existingEvaluation.evaluator_email && (
                              <div>{existingEvaluation.evaluator_email}</div>
                            )}
                          </div>
                        </div>
                      )}

                    {/* LLM Info */}
                    {existingEvaluation.evaluation_type === "llm" && (
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          LLM Details
                        </label>
                        <div className="text-sm text-muted-foreground space-y-1">
                          {existingEvaluation.llm_model && (
                            <div>Model: {existingEvaluation.llm_model}</div>
                          )}
                          {existingEvaluation.llm_confidence && (
                            <div>
                              Confidence:{" "}
                              {(
                                existingEvaluation.llm_confidence * 100
                              ).toFixed(1)}
                              %
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Metadata */}
                    <div className="pt-4 border-t">
                      <div className="text-sm text-muted-foreground space-y-1">
                        {existingEvaluation.evaluation_duration_seconds !==
                          null &&
                          existingEvaluation.evaluation_duration_seconds !==
                            undefined && (
                            <div>
                              Evaluation Duration:{" "}
                              {Math.floor(
                                existingEvaluation.evaluation_duration_seconds /
                                  60
                              )}
                              :
                              {(
                                existingEvaluation.evaluation_duration_seconds %
                                60
                              )
                                .toString()
                                .padStart(2, "0")}
                            </div>
                          )}
                        {existingEvaluation.evaluation_created_at && (
                          <div>
                            Created:{" "}
                            {new Date(
                              existingEvaluation.evaluation_created_at
                            ).toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Right Column - Additional Info */}
              <div>
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Analysis Summary
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 mb-2">
                        Performance Highlights
                      </h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Overall Score: {existingEvaluation.score}/10</li>
                        <li>
                          • Evaluation Type:{" "}
                          {existingEvaluation.evaluation_type}
                        </li>
                        <li>
                          • Communication:{" "}
                          {existingEvaluation.communication_score !== null &&
                          existingEvaluation.communication_score !== undefined
                            ? `${existingEvaluation.communication_score}/10`
                            : "Not set"}
                        </li>
                        <li>
                          • Professionalism:{" "}
                          {existingEvaluation.professionalism_score !== null &&
                          existingEvaluation.professionalism_score !== undefined
                            ? `${existingEvaluation.professionalism_score}/10`
                            : "Not set"}
                        </li>
                        <li>
                          • Problem Solving:{" "}
                          {existingEvaluation.problem_solving_score !== null &&
                          existingEvaluation.problem_solving_score !== undefined
                            ? `${existingEvaluation.problem_solving_score}/10`
                            : "Not set"}
                        </li>
                      </ul>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          ) : (
            /* Show evaluation form */
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">New Evaluation</h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Evaluation Type */}
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
                    <SelectContent>
                      <SelectItem value="human">Human Evaluation</SelectItem>
                      <SelectItem value="llm">LLM Evaluation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column - Scores */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Scores</h4>

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
                    <h4 className="font-medium">Details</h4>

                    {/* Notes */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Notes
                      </label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Provide detailed evaluation notes..."
                        rows={4}
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
