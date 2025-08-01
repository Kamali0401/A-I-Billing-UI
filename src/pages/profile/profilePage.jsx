import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfileList, updateProfile } from "../../app/redux/slice/profile/profileSlice";
import RestaurantProfileForm from "../../pages/profile/profileForm";
import RestaurantProfileModal from "../../pages/profile/profileModal";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { data, loading } = useSelector((state) => state.profileList);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    dispatch(fetchProfileList());
  }, [dispatch]);

  const handleEdit = (data) => {
    setFormData(data);
    setEditModalOpen(true);
  };

  const handleUpdate = (updatedData) => {
    dispatch(updateProfile(updatedData));
    setEditModalOpen(false);
  };

 

  return (
    <>
      {data.length > 0 && (
        <>
          <RestaurantProfileForm data={data[0]} onEdit={handleEdit} />
          <RestaurantProfileModal
            isOpen={editModalOpen}
            onClose={() => setEditModalOpen(false)}
            data={formData}
            onSave={handleUpdate}
          />
        </>
      )}
    </>
  );
};

export default ProfilePage;
