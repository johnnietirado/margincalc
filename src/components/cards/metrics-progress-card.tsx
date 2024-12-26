import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface MetricsProgressCardProps {
  title: string;
  amount: string;
  percentageChange: number;
}

export default function MetricsProgressCard({
  title,
  amount,
  percentageChange,
}: MetricsProgressCardProps) {
  return (
    <Card x-chunk="dashboard-05-chunk-1">
      <CardHeader className="pb-2">
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-4xl">{amount}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-xs text-muted-foreground">
          +{percentageChange}% from last week
        </div>
      </CardContent>
      <CardFooter>
        <Progress
          value={percentageChange}
          aria-label={`${percentageChange}% change`}
        />
      </CardFooter>
    </Card>
  );
}
