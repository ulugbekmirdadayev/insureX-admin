import React from "react";
import { LoadingOverlay, Header, ActionIcon, Grid } from "@mantine/core";
import axios from "axios";
import { getFormData, _URL } from "../utils";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { PlusUser } from "../icons";
import { Trash } from "tabler-icons-react";
import { useSelector } from "react-redux";
import SearchComponent from "../ui/search";

function Rows({
  item,
  setElements,
  datas,
  isCompanys,
  isRegions,
  appraiselCompanys,
}) {
  const { register, handleSubmit } = useForm();

  const [isUpdated, setIsUpdated] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const onSubmit = (data) => {
    data = { ...data, id: item.id };
    !data?.appraisal_company_id &&
      (data.appraisal_company_id =
        item?.appraisal_company_id ?? appraiselCompanys[0]?.id);
    !data?.insurance_company_id &&
      (data.insurance_company_id =
        item?.insurance_company_id ?? isCompanys[0]?.id);
    !data?.region_id && (data.region_id = item?.region_id ?? isRegions[0]?.id);

    if (data?.id) {
      const formData = { ...data, role: "appraiser" };
      delete formData.id;

      setIsLoading(true);
      axios
        .patch(`${_URL}/appraisers/${item.id}`, getFormData(formData), {
          headers: {
            Authorization: `"Bearer ${
              JSON.parse(localStorage.getItem("admin-panel-token-insure-x"))
                .token
            } `,
          },
        })
        .then((res) => {
          setIsLoading(false);
          toast.success("Updated");
          setIsUpdated(false);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
          toast.error("Error while updating data");
        });
    }
    if (item?.new) {
      const formData = data;
      setIsLoading(true);
      delete formData?.new;
      delete formData?.id;
      axios
        .post(`${_URL}/appraisers`, getFormData(formData), {
          headers: {
            Authorization: `"Bearer ${
              JSON.parse(localStorage.getItem("admin-panel-token-insure-x"))
                .token
            } `,
          },
        })
        .then((res) => {
          setIsLoading(false);
          setElements(
            [...datas, res.data.message.appraiser].filter((item) => !item.new)
          );
          toast.success("Data uploaded, new users created");
          setIsUpdated(false);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
          toast.error("Error loading data, please try again");
        });
    }
  };

  return (
    <>
      <form className="row" onSubmit={handleSubmit(onSubmit)}>
        <LoadingOverlay visible={isLoading} />
        <select
          className="multiples-select"
          onInput={(e) => {
            e.target.value !== item?.insurance_company_id
              ? setIsUpdated(true)
              : setIsUpdated(false);
            item.insurance_company_id = e.target.value;
          }}
          value={
            isCompanys?.filter(
              (options) => options.id === item?.insurance_company_id
            )[0]?.id
          }
          {...register(`insurance_company_id`)}
        >
          {isCompanys?.map((options) => (
            <option key={options.id} value={options.id}>
              {options.title}
            </option>
          ))}
        </select>
        <select
          onInput={(e) => {
            e.target.value !== item?.appraisal_company_id
              ? setIsUpdated(true)
              : setIsUpdated(false);
            item.appraisal_company_id = e.target.value;
          }}
          value={
            appraiselCompanys?.find(
              (options) => options?.id === item?.appraisal_company_id
            )?.id
          }
          {...register(`appraisal_company_id`)}
        >
          {appraiselCompanys?.map((options) => (
            <option key={options?.id} value={options?.id}>
              {options?.appraisal_company_name}
            </option>
          ))}
        </select>

        <input
          onInput={(e) => {
            e.target.value !== item?.first_name
              ? setIsUpdated(true)
              : setIsUpdated(false);
          }}
          defaultValue={item?.first_name}
          {...register(`first_name`)}
        />
        <input
          onInput={(e) => {
            e.target.value !== item?.second_name
              ? setIsUpdated(true)
              : setIsUpdated(false);
          }}
          defaultValue={item?.second_name}
          {...register(`second_name`)}
        />
        <input
          onInput={(e) => {
            e.target.value !== item?.phone
              ? setIsUpdated(true)
              : setIsUpdated(false);
          }}
          defaultValue={item?.phone}
          type="tel"
          {...register(`phone`)}
        />
        <input
          onInput={(e) => {
            e.target.value !== item?.passport_id
              ? setIsUpdated(true)
              : setIsUpdated(false);
          }}
          defaultValue={item?.passport_id}
          {...register(`passport_id`)}
        />
        <input
          onInput={(e) => {
            e.target.value !== item?.email
              ? setIsUpdated(true)
              : setIsUpdated(false);
          }}
          defaultValue={item?.email}
          type="email"
          {...register(`email`)}
        />
        <select
          onInput={(e) => {
            e.target.value !== item?.region_id
              ? setIsUpdated(true)
              : setIsUpdated(false);
            item.region_id = e.target.value;
          }}
          value={
            isRegions?.find((options) => options.id === item?.region_id)?.id
          }
          {...register(`region_id`)}
        >
          {isRegions?.map((options) => (
            <option key={options?.id} value={options?.id}>
              {options?.region_name}
            </option>
          ))}
        </select>

        <input
          onInput={(e) => {
            e.target.value !== item?.address
              ? setIsUpdated(true)
              : setIsUpdated(false);
          }}
          defaultValue={item?.address}
          {...register(`address`)}
        />
        {isUpdated ? (
          <button type="submit">{item?.id ? "Update" : "Create"}</button>
        ) : (
          <div
            title="Удалить"
            type="button"
            className="delete"
            onClick={() => {
              if (!item?.id) {
                setElements(datas.filter((item) => item?.new !== true));
              }
              if (item?.id) {
                setIsLoading(true);
                axios
                  .patch(
                    `${_URL}/appraisers/${item.id}`,
                    getFormData({
                      delete: true,
                    })
                  )
                  .then((res) => {
                    setIsLoading(false);
                    setElements(
                      datas.filter((__res) => __res?.id !== item?.id)
                    );
                    toast.success("Removed");
                  })
                  .catch((err) => {
                    console.log(err);
                    setIsLoading(false);
                    toast.error("Error when deleting data");
                  });
              }
            }}
          >
            <ActionIcon color="red">
              <Trash size={16} />
            </ActionIcon>
          </div>
        )}
      </form>
    </>
  );
}

export default function Persons() {
  const [elements, setElements] = React.useState([]);
  const [isCompanys, setIsCompanys] = React.useState([]);
  const [isRegions, setIsRegions] = React.useState([]);
  const [appraiselCompanys, setAppraiselCompanys] = React.useState([]);
  const user = useSelector((state) => state.user);
  const GlobalState = useSelector((state) => state);
  const [filteredData, setFilteredData] = React.useState([]);
  const [inputText, setInputText] = React.useState("");

  React.useEffect(() => {
    if (user.role === "superadmin") {
      setElements(GlobalState?.appraiser?.appraiser);
    }
    if (user.role === "insurance_company") {
      setElements(
        GlobalState?.appraiser?.appraiser?.filter(
          (res) =>
            Number(res?.insurance_company_id) ===
            Number(user.insurance_company.id)
        )
      );
    }
    if (user.role === "appraisal_company") {
      setElements(
        GlobalState?.appraiser?.appraiser?.filter(
          (res) =>
            Number(res?.appraisal_company_id) ===
            Number(user.appraisal_company.id)
        )
      );
    }
  }, [GlobalState]);

  React.useEffect(() => {
    if (user.role === "superadmin" || user.role === "appraisal_company") {
      axios
        .get(`${_URL}/insurance-companies?delete=false`, {
          headers: {
            Authorization: `"Bearer ${
              JSON.parse(localStorage.getItem("admin-panel-token-insure-x"))
                .token
            } `,
          },
        })
        .then((res) => {
          setIsCompanys(
            res?.data?.message?.insurance_companies?.filter(
              (item) => !item?.delete
            )
          );
        });
    }
    if (user.role === "insurance_company") {
      setIsCompanys(
        [user.insurance_company] // res?.data?.message?.insurance_companies
      );
    }
    if (user.role === "superadmin" || user.role === "insurance_company") {
      axios
        .get(`${_URL}/appraisal-companies?delete=false`, {
          headers: {
            Authorization: `"Bearer ${
              JSON.parse(localStorage.getItem("admin-panel-token-insure-x"))
                .token
            } `,
          },
        })
        .then((res) => {
          setAppraiselCompanys(res?.data?.message?.appraisal_companies);
        });
    } else setAppraiselCompanys([user.appraisal_company]);
    axios
      .get(`${_URL}/regions`, {
        headers: {
          Authorization: `"Bearer ${
            JSON.parse(localStorage.getItem("admin-panel-token-insure-x")).token
          } `,
        },
      })
      .then((res) => {
        setIsRegions(res?.data?.message?.regions);
      });
  }, [GlobalState]);

  return (
    <>
      <Header height={60} p="xs">
        <Grid>
          <Grid.Col span={3}>
            <button
              className="adder"
              onClick={() => {
                if (elements.filter((item) => item?.new)?.length) {
                  toast.error(
                    "You cannot add new entries until you finish the previous one."
                  );
                } else {
                  setElements(elements?.concat([{ new: true }])?.reverse());
                  toast.success("You can fill in a new entry");
                }
              }}
            >
              <span>Add </span>
              <PlusUser color={"#fff"} />
            </button>
          </Grid.Col>
          <Grid.Col span={3}>
            <SearchComponent
              data={elements?.filter((resp) => !resp.delete)}
              setFilteredData={setFilteredData}
              setInputText={setInputText}
              type={"first_name"}
            />
          </Grid.Col>
        </Grid>
      </Header>
      <div className="ox-scroll">
        <div className="row">
          <input
            className="disabled multiples-select"
            readOnly={true}
            value={"insurance_company "}
          />
          <input
            className="disabled"
            readOnly={true}
            value={"appraisal_company"}
          />
          <input className="disabled" readOnly={true} value={"fist_name"} />
          <input className="disabled" readOnly={true} value={"last_name"} />
          <input className="disabled" readOnly={true} value={"phone"} />
          <input className="disabled" readOnly={true} value={"Login ID"} />
          <input className="disabled" readOnly={true} value={"email"} />
          <input className="disabled" readOnly={true} value={"region"} />
          <input className="disabled" readOnly={true} value={"address"} />
        </div>
        {(inputText
          ? filteredData
          : elements?.filter((resp) => !resp.delete)?.reverse()
        ).map((item, i) => (
          <Rows
            key={item?.id ?? i}
            item={item}
            setElements={setElements}
            datas={elements}
            isCompanys={isCompanys}
            isRegions={isRegions}
            appraiselCompanys={appraiselCompanys}
          />
        ))}
      </div>
    </>
  );
}
