import DemoSection from "./components/DemoSection";
import PageHeaders from "./components/PageHeaders";
import UploadForm from "./components/UploadForm";


export default function Home() {
  return (
    <>
      <PageHeaders 
        h1Text={'Add captions to any of your videos'}
        h2Text={'Upload your videos right now!'}/>
      <UploadForm />
      <DemoSection />
    </>
  );
}
