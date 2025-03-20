import { Fragment, useState } from "react";
import { FaEye } from "react-icons/fa6";
import { FiEyeOff } from "react-icons/fi";
import bgImage from '../../../assets/biodiversity-bg.jpeg';
import logo from '../../../assets/ustp-logo-on-white.png';
import { supabase } from "../../core/lib/supabase";
import { toast } from "react-toastify";
import { Form, FormikProvider, useFormik } from "formik";
import TextField from "../../core/components/textfield";
import { authValidationSchema } from "../../core/schema/auth.schema";
import LoadingButton from "../../core/components/loadingbutton";
import { useAuthStore } from "../../core/zustand/auth";
import { Session, User } from "@supabase/supabase-js";

export default function Auth() {

    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const { setUser, setSession } = useAuthStore();


    const handleLogin = async (values: { email: string, password: string }) => {
        try {
            setLoading(true);
            const { data, error } = await supabase.auth.signInWithPassword({
                email: values.email,
                password: values.password
            });
            if (error) {
                toast.error(error.message);
                return;
            }
            setUser(data?.user as User);
            setSession(data?.session as Session);
            window.location.href = '/admin';
        } catch (error: unknown) {
            toast.error(error as string);
        } finally {
            setLoading(false);
        }
    }


    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: authValidationSchema,
        onSubmit: async (values) => {
            handleLogin(values);
        }
    })

    return (
        <Fragment>
            <div className="flex flex-col items-center justify-center h-screen" style={{
                backgroundImage: `url(${bgImage})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
            }}>
                <div className="bg-white opacity-90 p-4 rounded-md">
                    <div className="flex flex-col items-center justify-center mt-6">
                        <img src={logo} alt="USTP Logo" className="w-20 h-20 mb-6" />
                        <h1 className="text-3xl font-bold">USTP Biodiversity</h1>
                    </div>
                    <FormikProvider value={formik}>
                        <Form className="flex flex-col items-center justify-center gap-4 border-[1px] p-4 rounded-md mt-6 w-96 ">
                            <div className="flex flex-1 flex-col w-full">
                                <TextField
                                    name="email"
                                    type="email"
                                    placeholder="Email"
                                    variant="primary"
                                    size="md"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.email}
                                    error={formik.touched.email && !!formik.errors.email}
                                    errorText={formik.errors.email}
                                    required
                                />
                            </div>
                            <div className="flex flex-1 flex-col w-full">
                                <TextField
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Password"
                                    variant="primary"
                                    size="md"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.password}
                                    error={formik.touched.password && !!formik.errors.password}
                                    errorText={formik.errors.password}
                                    required
                                    rightIcon={showPassword ? <FaEye className="hover:cursor-pointer" onClick={() => setShowPassword(!showPassword)} /> : <FiEyeOff className="hover:cursor-pointer" onClick={() => setShowPassword(!showPassword)} />}
                                />
                            </div>
                            <LoadingButton
                                type="submit"
                                variant="primary"
                                isLoading={loading}
                                disabled={loading}
                                className="w-full bg-blue-700 hover:!bg-blue-800"
                            >
                                Login
                            </LoadingButton>
                        </Form>
                    </FormikProvider>
                </div>
            </div>
        </Fragment>
    )
}