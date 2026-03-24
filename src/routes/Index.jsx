import { lazy, Suspense } from "react";
import { Outlet, useRoutes } from "react-router-dom";
import LoadingScreen from "../components/loading/PreLoader";
import Layout from "../layout/Layout"
import AppGuard from "../components/protect-routes/AppGuard";
import AuthGuard from "../components/protect-routes/AuthGuard";
import TransparencyExplainabilityContainer from "../page/transparencyexplainability/TransparencyExplainability";

const LoginPage = lazy(() => import("../page/auth/Index"));
const RoiPage = lazy(() => import("../page/roi/Index"))

const FairnessAndNonDiscriminationPage = lazy(() => import("../page/fairnessandondiscrimination/Index"))
const AccountabilityPage = lazy(() => import("../page/accountability/index"))
const SafetyAndReliabilityPage = lazy(() => import("../page/safetyandReliability/Index"))
const InclusivenessPage = lazy(() => import("../page/inclusiveness/Index"))
const EnvironmentSustainabilityPage = lazy(() => import("../page/environmentsustainability/Index"))
const PrivacyAndDataSecurityPage = lazy(() => import("../page/privacyanddataSecurity/Index"))
const TransparencyExplainabilityPage = lazy(() => import("../page/transparencyexplainability/TransparencyExplainability"));

const Router = () => {
    const routes = useRoutes([
        {
            path: "/",
            element: (
                <AppGuard>
                    <Suspense fallback={<LoadingScreen />}>
                        <LoginPage />
                    </Suspense>
                </AppGuard>
            ),
        },
        {
            path: "/login",
            element: (
                <AppGuard>
                    <Suspense fallback={<LoadingScreen />}>
                        <LoginPage />
                    </Suspense>
                </AppGuard>
            ),
        },
        {
            path: "/app",
            element: <AuthGuard><Layout><Outlet /></Layout></AuthGuard>,
            children: [
                // {
                //     path: "roi",
                //     element: (
                //         <Suspense fallback={<LoadingScreen />}>
                //             <RoiPage />
                //         </Suspense>
                //     ),
                // },
                {
                    path: "transparencyexplainability",
                    element: (
                        <Suspense fallback={<LoadingScreen />}>
                            <TransparencyExplainabilityContainer />
                        </Suspense>
                    ),
                },
                {
                    path: "fairnessandondiscrimination",
                    element: (
                        <Suspense fallback={<LoadingScreen />}>
                            <FairnessAndNonDiscriminationPage />
                        </Suspense>
                    ),
                },
                {
                    path: "safetyandreliability",
                    element: (
                        <Suspense fallback={<LoadingScreen />}>
                            <SafetyAndReliabilityPage />
                        </Suspense>
                    ),
                },
                {
                    path: "inclusiveness",
                    element: (
                        <Suspense fallback={<LoadingScreen />}>
                            <InclusivenessPage />
                        </Suspense>
                    ),
                },
                {
                    path: "environmentsustainability",
                    element: (
                        <Suspense fallback={<LoadingScreen />}>
                            <EnvironmentSustainabilityPage />
                        </Suspense>
                    ),
                },
                {
                    path: "accountability",
                    element: (
                        <Suspense fallback={<LoadingScreen />}>
                            <AccountabilityPage />
                        </Suspense>
                    ),
                },
                {
                    path: "privacyanddatasecurity",
                    element: (
                        <Suspense fallback={<LoadingScreen />}>
                            <PrivacyAndDataSecurityPage />
                        </Suspense>
                    ),
                },
                {
                    path: "transparencyexplainability",
                    element: (
                        <Suspense fallback={<LoadingScreen />}>
                            <TransparencyExplainabilityPage />
                        </Suspense>
                    ),
                }

            ]
        }])

    return routes;
};

export default Router;


