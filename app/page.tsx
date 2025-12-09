import AnalyzeContent from "@/components/AnalyzeContent";

export default function Home() {
    const ingredients:string = "https://images.media.gianteagle.com/00028400516464-3ab2d665-6803-4849-8d10-4f7898174afb.png?fill=solid&fit=fill&h=768&q=80&w=768";

  return (
      <main className="flex flex-col items-center justify-center p-6 md:bg-gray-100">
          <div className="w-full h-screen max-w-full">
              <div className="text-center m-5">
                    <AnalyzeContent/>
              </div>
          </div>
      </main>
  );
}
