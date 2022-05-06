import { Box, Typography, Button, TextField } from "@mui/material";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createQuestion } from "../features/questions/questionSlice";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import style manually
import "react-markdown-editor-lite/lib/index.css";
import { reset } from "../features/questions/questionSlice";
import AlertMessage from "../components/AlertMessage";
import Spinner from "../components/Spinner";
import ReactTagInput from "@pathofdev/react-tag-input";
import "@pathofdev/react-tag-input/build/index.css";
import { DropzoneArea } from "material-ui-dropzone";
import axios from "axios";

const mdParser = new MarkdownIt(/* Markdown-it options */);

function QuestionForm() {
    const [snackbar, setSnackbar] = useState("");
    const [tags, setTags] = useState([]);
    const [file, setFile] = useState([]);
    const [formData, setFormData] = useState({
        title: "",
        description: {
            html: "",
            text: "",
        },
    });
    const { title, description } = formData;

    const onSubmit = async (e) => {
        e.preventDefault();
        if (description.html === "" || description.text === "") {
            setSnackbar({
                msg: "Please fill in the description.",
                key: Math.random(),
                severity: "error",
            });
            return;
        }
        if (tags.length === 0) {
            setSnackbar({
                msg: "Please create a tag",
                key: Math.random(),
                severity: "error",
            });
            return;
        }
        let imageSrc = [];
        if (file.length > 0) {
            // get secure url
            const config = {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            };
            const promise = file.map(async (file) => {
                const uploadLink = await axios.get("/api/s3url");
                await axios
                    .put(uploadLink.data.url, file, config)
                    .catch((err) => {
                        throw err;
                    });
                const imageUrl = uploadLink.data.url.split("?")[0];
                return imageUrl;
            });
            let images = await Promise.all(promise);
            imageSrc = imageSrc.concat(images);
        }
        const questionData = {
            title,
            description,
            tags,
            views: 0,
            images: imageSrc,
        };
        const json = await dispatch(createQuestion(questionData));
        if (json.meta.requestStatus === "rejected") {
            setSnackbar({
                msg: "Please fill in the description.",
                key: Math.random(),
                severity: "error",
            });
            return;
        }
        if (json.meta.requestStatus === "fulfilled") {
            setFormData({
                title: "",
                description: {
                    html: "",
                    text: "",
                },
            });
            setFile([]);
            setSnackbar("");
            navigate(`/${json.payload._id.toString()}`);
        }
    };

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const handleEditorChange = ({ html, text }) => {
        setFormData((prevState) => ({
            ...prevState,
            description: {
                html: html,
                text: text,
            },
        }));
    };

    /* REDUX STUFF*/
    const { user } = useSelector((state) => state.auth);
    const { isLoading, isError, message } = useSelector(
        (state) => state.questions
    );
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if (isError) {
            setSnackbar({
                msg: message,
                key: Math.random(),
                severity: "error",
            });
        }
        if (!user) {
            navigate("/login");
        }
        return () => {
            dispatch(reset());
        };
    }, [user, navigate, isError, message, dispatch]);

    return (
        <section className="form">
            {isLoading ? <Spinner isLoading={isLoading} /> : null}
            <form onSubmit={onSubmit}>
                <Typography sx={{ typography: { sm: "h6", xs: "p" } }}>
                    Ask a Question
                </Typography>
                <Box
                    sx={{
                        marginTop: {
                            xs: "10px",
                            md: "15px",
                            xl: "20px",
                        },
                        padding: {
                            xs: "10px 15px",
                            md: "20px 25px",
                            xl: "25px 30px",
                        },
                        borderRadius: "5px",
                        backgroundColor: "white",
                        border: "1px solid rgb(222, 223, 224)",
                    }}
                >
                    <Typography
                        sx={{
                            typography: { sm: "h6", xs: "p" },
                            marginBottom: {
                                xs: "5px",
                                md: "10px",
                                xl: "15px",
                            },
                        }}
                    >
                        Title
                    </Typography>
                    <TextField
                        name="title"
                        required
                        fullWidth
                        id="title"
                        value={title}
                        onChange={onChange}
                        autoFocus
                    />
                </Box>
                <Box
                    sx={{
                        marginTop: {
                            xs: "10px",
                            md: "15px",
                            xl: "20px",
                        },
                        padding: {
                            xs: "10px 15px",
                            md: "20px 25px",
                            xl: "25px 30px",
                        },
                        borderRadius: "5px",
                        backgroundColor: "white",
                        border: "1px solid rgb(222, 223, 224)",
                    }}
                >
                    <Typography
                        sx={{
                            typography: { sm: "h6", xs: "p" },
                            marginBottom: {
                                xs: "5px",
                                md: "10px",
                                xl: "15px",
                            },
                        }}
                    >
                        Full Description
                    </Typography>
                    <MdEditor
                        style={{ height: "300px" }}
                        renderHTML={(text) => mdParser.render(text)}
                        onChange={handleEditorChange}
                    />
                </Box>
                <Box
                    sx={{
                        marginTop: {
                            xs: "10px",
                            md: "15px",
                            xl: "20px",
                        },
                        padding: {
                            xs: "10px 15px",
                            md: "20px 25px",
                            xl: "25px 30px",
                        },
                        borderRadius: "5px",
                        backgroundColor: "white",
                        border: "1px solid rgb(222, 223, 224)",
                    }}
                >
                    <Typography
                        sx={{
                            typography: { sm: "h6", xs: "p" },
                            marginBottom: {
                                xs: "5px",
                                md: "10px",
                                xl: "15px",
                            },
                        }}
                    >
                        Tags
                    </Typography>
                    <ReactTagInput
                        removeOnBackspace={true}
                        maxTags={5}
                        tags={tags}
                        onChange={(newTags) => setTags(newTags)}
                    />
                </Box>
                <Box
                    sx={{
                        marginTop: {
                            xs: "10px",
                            md: "15px",
                            xl: "20px",
                        },
                        padding: {
                            xs: "10px 15px",
                            md: "20px 25px",
                            xl: "25px 30px",
                        },
                        borderRadius: "5px",
                        backgroundColor: "white",
                        border: "1px solid rgb(222, 223, 224)",
                    }}
                >
                    <Typography
                        sx={{
                            typography: { sm: "h6", xs: "p" },
                            marginBottom: {
                                xs: "5px",
                                md: "10px",
                                xl: "15px",
                            },
                        }}
                    >
                        Upload Images
                    </Typography>
                    <DropzoneArea
                        acceptedFiles={["image/*"]}
                        onChange={setFile}
                        showFileNames
                        dropzoneText="Upload Your Image"
                        showAlerts={false}
                        filesLimit={20}
                    />
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        width: "100%",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        mt: 3,
                    }}
                >
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{
                            width: { xs: "120px" },
                        }}
                    >
                        submit
                    </Button>
                </Box>
            </form>
            {/* {imageSrc.length > 0
                ? imageSrc.forEach((img) => {
                      <img src={img} alt="new" />;
                  })
                : null} */}
            {snackbar ? (
                <AlertMessage
                    key={snackbar.key}
                    message={snackbar.msg}
                    severity={snackbar.severity}
                />
            ) : null}
        </section>
    );
}

export default QuestionForm;
