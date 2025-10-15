"use client";

import React, { useState } from "react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { insertSpidyData } from "@/actions/insertAction";
import { Card, CardContent } from "./ui/card";
import { Loader } from "lucide-react";

export default function LoadRagForm() {
  const [content, setContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const handleSubmission = async () => {
    if (!content.trim()) return;
    setIsLoading(true);
    setMessage("");

    try {
      const { success } = await insertSpidyData(content);
      if (success) {
        setMessage("Content loaded successfully!");
        setContent("");
      } else {
        setMessage("Failed to load content. Try again.");
      }
    } catch (err) {
      console.log(err);
      setMessage("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl  p-6 h-[calc(100vh-70px)] flex justify-center flex-col">
      <Card>
        <CardContent className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">
            Load Content to RAG
          </h2>

          <label className="block text-sm font-medium text-muted-foreground">
            Enter content
          </label>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste your content here..."
            rows={6}
            className="resize-none"
          />

          {message && (
            <p
              className={`text-sm ${
                message.includes("success") ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}

          <Button
            onClick={handleSubmission}
            disabled={isLoading || !content.trim()}
            className="flex gap-2"
          >
            {isLoading ? "Saving" : "Save"}
            {isLoading && <Loader className="animate-spin" />}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
