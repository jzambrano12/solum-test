import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const Pagination = () => {
  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-muted-foreground">
        Showing 1 to 5 of 23 results
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          className="border-input hover:bg-secondary-hover"
          disabled
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>

        <div className="flex items-center space-x-1">
          <Button
            variant="default"
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary-hover"
          >
            1
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-input hover:bg-secondary-hover"
          >
            2
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-input hover:bg-secondary-hover"
          >
            3
          </Button>
          <span className="px-2 text-muted-foreground">...</span>
          <Button
            variant="outline"
            size="sm"
            className="border-input hover:bg-secondary-hover"
          >
            5
          </Button>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="border-input hover:bg-secondary-hover"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};
