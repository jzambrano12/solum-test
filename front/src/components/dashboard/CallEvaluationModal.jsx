"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// Mock LLM analysis data
const mockLLMAnalysis = {
  call_123456: {
    score: 7,
    notes:
      "The agent demonstrated good communication skills and was helpful throughout the call. However, there were a few instances where the response time could have been improved. The agent successfully resolved the customer's main concern and provided additional helpful information about the service. Overall, a solid performance with room for minor improvements in efficiency.",
  },
  call_789012: {
    score: 9,
    notes:
      "Excellent call handling with professional demeanor throughout. The agent was proactive in addressing customer needs and provided clear, accurate information. Response times were optimal and the customer seemed very satisfied with the service. This represents exemplary customer service skills.",
  },
  call_345678: {
    score: 6,
    notes:
      "The agent handled the basic requirements adequately but missed some opportunities to provide additional value to the customer. There were a few moments of uncertainty that could have been handled more smoothly. The call resolution was satisfactory but could have been more comprehensive.",
  },
  call_901234: {
    score: 8,
    notes:
      "Strong performance with clear communication and good problem-solving skills. The agent was attentive to customer needs and provided thorough explanations. Minor improvements could be made in call flow optimization, but overall this was a well-handled interaction.",
  },
  call_567890: {
    score: 5,
    notes:
      "The call met basic requirements but there were several areas for improvement. The agent seemed unsure at times and could have been more proactive in addressing customer concerns. Response quality was acceptable but not exceptional. Additional training on product knowledge would be beneficial.",
  },
  call_112233: {
    score: 8,
    notes:
      "Professional and efficient call handling with clear communication throughout. The agent demonstrated good product knowledge and was able to address customer inquiries effectively. Minor areas for improvement include call pacing and some opportunities for upselling that were missed.",
  },
  call_445566: {
    score: 6,
    notes:
      "Adequate performance with room for improvement. The agent was courteous and attempted to help the customer, but there were some knowledge gaps that led to longer resolution times. Customer satisfaction appeared moderate. Additional training on technical aspects would be beneficial.",
  },
  call_778899: {
    score: 7,
    notes:
      "Good overall performance with strong customer service skills. The agent was patient and thorough in addressing customer concerns. Communication was clear and professional. Some opportunities for process optimization were identified that could improve efficiency.",
  },
};

export const CallEvaluationModal = ({ isOpen, onClose, call }) => {
  const [qualityScore, setQualityScore] = useState(5);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const llmAnalysis = call ? mockLLMAnalysis[call.externalCallId] : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("Evaluation submitted:", {
      callId: call?.externalCallId,
      qualityScore,
      notes,
    });

    setIsSubmitting(false);
    onClose();

    // Reset form
    setQualityScore(5);
    setNotes("");
  };

  if (!call) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Evaluating Call ID: {call.externalCallId}
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-6">
          {/* Audio Player Section */}
          <div className="mb-8">
            <Card className="p-6 bg-gray-50">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Call Recording</h3>
                  <span className="text-sm text-muted-foreground">
                    Duration: {Math.floor(call.durationInSeconds / 60)}:
                    {(call.durationInSeconds % 60).toString().padStart(2, "0")}
                  </span>
                </div>

                {/* Audio Player */}
                <div className="bg-white rounded-lg p-4 border">
                  <audio controls className="w-full" style={{ height: "40px" }}>
                    <source
                      src={`/api/audio/${call.externalCallId}.mp3`}
                      type="audio/mpeg"
                    />
                    Your browser does not support the audio element.
                  </audio>
                </div>

                {/* Timeline info */}
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>00:00</span>
                  <span>
                    {Math.floor(call.durationInSeconds / 60)}:
                    {(call.durationInSeconds % 60).toString().padStart(2, "0")}
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Your Evaluation */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Your Evaluation</h3>

              <form
                onSubmit={handleSubmit}
                className="space-y-6 evaluation-form"
              >
                {/* Quality Score Section */}
                <div>
                  <label className="block text-sm font-medium mb-3">
                    Quality Score (1-10)
                  </label>

                  {/* Score Slider */}
                  <div className="space-y-4">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={qualityScore}
                      onChange={(e) => setQualityScore(Number(e.target.value))}
                      className="w-full evaluation-slider"
                      style={{
                        background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${
                          (qualityScore - 1) * 11.11
                        }%, #e5e7eb ${
                          (qualityScore - 1) * 11.11
                        }%, #e5e7eb 100%)`,
                      }}
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>1</span>
                      <span className="font-medium text-lg text-foreground">
                        {qualityScore}
                      </span>
                      <span>10</span>
                    </div>
                  </div>
                </div>

                {/* Notes Section */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Evaluation Notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Provide detailed notes here..."
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                >
                  {isSubmitting ? "Submitting..." : "Submit Evaluation"}
                </Button>
              </form>
            </div>

            {/* Right Column - LLM Analysis */}
            <div>
              <h3 className="text-lg font-semibold mb-4">LLM Judge Analysis</h3>

              <div className="space-y-6">
                {/* LLM Score */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    LLM Score
                  </label>
                  <div className="flex items-center space-x-2">
                    <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-semibold text-lg">
                      {llmAnalysis?.score || "N/A"}/10
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(llmAnalysis?.score || 0) * 10}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* LLM Notes */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    LLM Notes
                  </label>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 min-h-[200px]">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {llmAnalysis?.notes ||
                        "No analysis available for this call."}
                    </p>
                  </div>
                </div>

                {/* Additional LLM Insights */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">
                    Key Insights
                  </h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Communication clarity assessed</li>
                    <li>• Response time evaluated</li>
                    <li>• Customer satisfaction indicators analyzed</li>
                    <li>• Professional demeanor scored</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
