import { useEffect, useRef } from 'react';
import EmailEditor, { EditorRef } from 'react-email-editor';

const EmailEditorPage = () => {

    const emailEditorRef = useRef<EditorRef | null>(null);

    let savedDesign:any = null;

    const loadDesign = () => {
        emailEditorRef.current?.editor?.loadDesign(savedDesign);
    }

    const exportHtml = () => {
        emailEditorRef.current?.editor?.exportHtml((data) => {
          const { design, html } = data;
          console.log('exportHtml', html);
        })
    }

    const saveDesign = () => {
        emailEditorRef.current?.editor?.saveDesign((design) => {
          console.log('saveDesign', design);
          localStorage.setItem("emailDesign", JSON.stringify(design));
        })
    }

    useEffect(() => {
        savedDesign = JSON.parse(localStorage.getItem("emailDesign") || "{}");
    },[]);
    
    return (
        <div>
            <div>
                <button onClick={saveDesign}>
                    Save Design
                </button>
                <button onClick={exportHtml}>
                    Export HTML
                </button>
                <button onClick={loadDesign}>
                    Load Design
                </button>
            </div>
            <EmailEditor 
                ref={emailEditorRef} 
                options= {{
                    mergeTags: [{
                        name: "First Name",
                        value: "{{first_name}}",
                        sample: "John"
                    },
                    {
                        name: "Last Name",
                        value: "{{last_name}}",
                        sample: "Doe"
                    }]
                }}
            />
        </div>
    )
}
export default EmailEditorPage;