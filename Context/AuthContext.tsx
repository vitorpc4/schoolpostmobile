import { createContext, PropsWithChildren, ReactNode, useContext } from "react";
import { useStorageState } from "./useStorageState";
import LoginRepository from "@/http/repository/LoginRepository/LoginRepository";
import { ApiResponse } from "@/http/Models/Responses/ApiResponse";
import { IloginResponse } from "@/http/Models/Responses/Login/ILoginResponse";
import TokenControl from "@/ModelViews/TokenControl";
import * as SecureStore from "expo-secure-store";
import IResponseToken from "@/http/Models/Responses/Login/IResponseToken";
import IUserSchoolAssociation from "@/interfaces/IUserSchoolAssociation";
import { AuthContextData } from "./AuthContextData";
import { SchoolRepository } from "@/http/repository/SchoolRepository/SchoolRepository";

const AuthContext = createContext<{
  signIn: (
    user: string,
    password: string
  ) => Promise<AuthContextData | undefined>;
  updateToken: (user: string, schoolName: string) => Promise<boolean>;
  signOut: () => void;
  checkSession: () => boolean;
  getUserDataSession: () => IUserSchoolAssociation[] | undefined;
  session?: string | null;
  isLoading: boolean;
}>({
  signIn: () => Promise.resolve(undefined),
  updateToken: () => Promise.resolve(false),
  signOut: () => {},
  checkSession: () => false,
  getUserDataSession: () => [],
  session: null,
  isLoading: true,
});

export function useSession() {
  const value = useContext(AuthContext);
  return value;
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [[isLoading, session], setSession] = useStorageState("session");
  return (
    <AuthContext.Provider
      value={{
        signIn: (user: string, password: string) => {
          return handleLogin(user, password)
            .then((data) => {
              if (!data) {
                return {
                  haveSchool: false,
                  success: false,
                } as AuthContextData;
              }
              const contextAuth: AuthContextData = {
                haveSchool: false,
                success: true,
              };

              if (data) {
                setSession(data);

                if (setUserData(user, data)) {
                  contextAuth.haveSchool = true;
                }
              }

              return contextAuth;
            })
            .catch((error) => {
              console.log("Error: ", error);
              return {
                haveSchool: false,
                success: false,
              } as AuthContextData;
            });
        },
        updateToken: (user: string, schoolName: string) => {
          const schoolRepository = new SchoolRepository();

          const result = schoolRepository
            .createSchool({
              name: schoolName,
              status: true,
            })
            .then((response) => {
              const newToken = response.data.token;

              setSession(newToken);
              setUserData(user, newToken);

              return true;
            })
            .catch((error) => {
              console.log("Error: ", error);
              return false;
            });

          return result;
        },
        signOut: () => {
          setSession(null);
          SecureStore.deleteItemAsync("users");
        },
        checkSession: () => {
          if (session) {
            SecureStore.getItemAsync("session").then((data) => {
              if (data == null) {
                return false;
              }

              const claims = getClaim(data);

              if (claims == null) return false;

              if (claims.expiration < Date.now()) {
                setSession(null);
                SecureStore.deleteItemAsync("users");
                return false;
              }

              return true;
            });
          }
          return false;
        },
        getUserDataSession: () => {
          return getUserData();
        },
        session,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

const handleLogin = async (user: string, password: string) => {
  const repository: LoginRepository = new LoginRepository();

  const result = await repository
    .Login({
      email: user,
      password: password,
    })
    .then(async (response: ApiResponse<IloginResponse>) => {
      const acess_token = response.data?.access_token ?? "";

      return acess_token;
    })
    .catch((error) => {
      console.log("Error: ", error);
    });

  return result;
};

const getClaim = (acess_token: string) => {
  if (acess_token != null) {
    const claims = atob(acess_token.split(".")[1]);
    const parsedClaims = JSON.parse(claims);
    parsedClaims.expiration = parsedClaims.exp * 1000;

    const tokenControl: TokenControl = {
      acess_token: acess_token,
      expiration: parsedClaims.expiration,
    };

    return tokenControl;
  }
};

const setUserData = (emailUser: string, acess_token: string) => {
  const claims = atob(acess_token.split(".")[1]);
  const dataJWTJson = JSON.parse(claims) as IResponseToken;

  const users: IUserSchoolAssociation[] = [];

  if (dataJWTJson.schools.length > 0) {
    dataJWTJson.schools.forEach((school) => {
      const userData: IUserSchoolAssociation = {
        user: {
          id: dataJWTJson.sub,
          username: dataJWTJson.userName,
          email: emailUser,
          status: true,
        },
        id: school.IUserAssociationId,
        school: {
          id: school.schoolId,
          name: school.name,
          status: true,
        },
        admin: school.admin,
        typeUser: school.typeUser,
        status: true,
      };

      users.push(userData);
    });
  }

  if (users.length > 0) {
    SecureStore.setItemAsync("users", JSON.stringify(users));
    return true;
  }

  return false;
};

const getUserData = () => {
  const result = SecureStore.getItem("users");

  if (result == null) {
    return;
  }

  const users = JSON.parse(result) as IUserSchoolAssociation[];

  return users;
};
