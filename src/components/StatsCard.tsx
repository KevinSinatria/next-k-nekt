import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";

export function StatsCard({
  title,
  desc,
  value,
}: {
  title: string;
  desc?: string | undefined;
  value: string | number;
}) {
  return (
    <Card className="shadow-sm rounded-2xl">
      <CardHeader>
        <CardTitle className="text-sm  text-muted-foreground">{title}</CardTitle>
        {desc && (
          <CardDescription className="text-xs text-muted-foreground">
            {desc}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}
