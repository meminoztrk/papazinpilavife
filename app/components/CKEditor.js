import React, { useEffect, useRef } from "react";
import { useLoaderData } from '@remix-run/react';

export const loader = async ({ request }) => {
    const data = {
        API: process.env.REACT_APP_API,
        API_KEY: process.env.REACT_APP_API_KEY,
        API_IMAGES: process.env.REACT_APP_IMAGES
    }
    return data
}

export default function CKEditor({ onChange, editorLoaded, name, value, endPoint }) {
    const { API, API_KEY, API_IMAGES } = useLoaderData();
    function uploadAdapter(loader) {
        return {
            upload: () => {
                return new Promise((resolve, reject) => {
                    const body = new FormData();
                    loader.file.then((file) => {
                        body.append("uploadImage", file);
                        fetch(`${API}/${endPoint}`, {
                            method: "post",
                            headers: {
                                'ApiKey': API_KEY,
                            },
                            body: body
                        })
                            .then((res => res.json()))
                            .then((res) => {
                                console.log(file)
                                resolve({ default: `${API_IMAGES}${res.url}` })
                            })
                            .catch((err) => {
                                console.log(file)
                                reject(err);
                            })
                    })
                })
            }
        }
    }

    function uploadPlugin(editor) {
        editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
            return uploadAdapter(loader);
        }
    }

    const editorRef = useRef();

    const { CKEditor, ClassicEditor } = editorRef.current || {};
    useEffect(() => {
        editorRef.current = {
            CKEditor: require("@ckeditor/ckeditor5-react").CKEditor,
            ClassicEditor: require("@ckeditor/ckeditor5-build-classic")
        };
    }, []);

    return (
        <>
            {editorLoaded ? (
                <CKEditor
                    config={{
                        extraPlugins: [uploadPlugin],
                    }}
                    type=""
                    name={name}
                    editor={ClassicEditor}
                    data={value}
                    onChange={(event, editor) => {
                        const data = editor.getData();
                        onChange(data);
                    }}
                />
            ) : (
                <div>Editor loading</div>
            )}
        </>
    )
}